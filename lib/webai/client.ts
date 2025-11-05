"use client";

/**
 * Browser-only AI wrapper using transformers.js
 * Uses Phi-3-mini-4k quantized (~400MB) for fast mobile-friendly inference
 */

export type WebAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type WebAIStatus = {
  initialized: boolean;
  modelId?: string;
  supported: boolean;
  reason?: string;
};

export type InitOptions = {
  modelId?: string; // defaults to "Xenova/Phi-3-mini-4k-instruct"
  onProgress?: (progress: {
    loaded: number;
    total: number;
    percent: number;
  }) => void;
};

type Pipeline = any; // transformers.js pipeline type

let pipeline: Pipeline | null = null;
let currentModelId: string | undefined;

function checkSupport(): { supported: boolean; reason?: string } {
  if (typeof window === "undefined") {
    return { supported: false, reason: "Server-side not supported" };
  }
  // Transformers.js works in all modern browsers with WASM
  return { supported: true };
}

// Helper to yield to event loop and prevent UI blocking
function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export const WebAI = {
  async initialize(options: InitOptions = {}): Promise<WebAIStatus> {
    console.info("[WebAI] initialize: start", { options });
    const support = checkSupport();
    if (!support.supported) {
      console.warn("[WebAI] initialize: unsupported", support);
      return { initialized: false, supported: false, reason: support.reason };
    }

    // Use a much smaller, faster model by default to prevent UI stalls
    const modelId = options.modelId ?? "Xenova/tinyllama-1.1b-chat-v1.0";

    if (pipeline && currentModelId === modelId) {
      console.info("[WebAI] initialize: reuse existing pipeline", { modelId });
      return { initialized: true, supported: true, modelId: currentModelId };
    }

    // Dynamic import to avoid bundling in server
    let createPipeline: any;
    let env: any;
    try {
      ({ pipeline: createPipeline, env } = await import(
        "@huggingface/transformers"
      ));
      console.info("[WebAI] transformers imported");
    } catch (e) {
      console.error("[WebAI] failed to import transformers", e);
      throw e;
    }

    // Use local cache; set progress callback
    env.allowLocalModels = false;
    env.allowRemoteModels = true;

    // Progress tracking via callback (guard against double-wrapping)
    if (options.onProgress && !(globalThis as any).__webai_progress_wrapped) {
      (globalThis as any).__webai_progress_wrapped = true;
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
        const startTs = Date.now();
        const response = await originalFetch(...args);
        const url = args[0] as Request | string as any;
        console.debug("[WebAI] fetch", {
          url: typeof url === "string" ? url : url?.url,
          status: response.status,
        });
        if (!response.ok || !response.body) return response;

        const reader = response.body.getReader();
        const contentLength = +(response.headers.get("Content-Length") ?? 0);
        let loaded = 0;

        const stream = new ReadableStream({
          async start(controller) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              loaded += value.byteLength;
              const percent =
                contentLength > 0
                  ? Math.min(
                      100,
                      Math.max(0, Math.round((loaded / contentLength) * 100)),
                    )
                  : 0;
              try {
                options.onProgress?.({ loaded, total: contentLength, percent });
                // Yield periodically to keep UI responsive
                if (loaded % 102400 === 0) await yieldToEventLoop();
              } catch {}
              controller.enqueue(value);
            }
            controller.close();
            console.debug("[WebAI] fetch complete", {
              url: typeof url === "string" ? url : url?.url,
              ms: Date.now() - startTs,
            });
          },
        });

        return new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
      };
    }

    // Yield before heavy operation
    await yieldToEventLoop();

    console.info("[WebAI] creating pipeline", { modelId });
    const t0 = Date.now();
    pipeline = await createPipeline("text-generation", modelId, {
      quantized: true,
    });
    console.info("[WebAI] pipeline ready", { ms: Date.now() - t0, modelId });

    currentModelId = modelId;
    return { initialized: true, supported: true, modelId: currentModelId };
  },

  async generate(
    messages: WebAIMessage[],
    opts?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    if (!pipeline)
      throw new Error("WebAI not initialized. Call initialize() first.");

    console.info("[WebAI] generate: start", {
      tokens: opts?.maxTokens,
      temperature: opts?.temperature,
    });
    // Yield before generation to keep UI responsive
    await yieldToEventLoop();

    // TinyLlama chat template format: <|system|>...<|user|>...<|assistant|>
    let prompt = "";
    for (const msg of messages) {
      if (msg.role === "system") {
        prompt += `<|system|>\n${msg.content}<|end|>\n`;
      } else if (msg.role === "user") {
        prompt += `<|user|>\n${msg.content}<|end|>\n`;
      } else if (msg.role === "assistant") {
        prompt += `<|assistant|>\n${msg.content}<|end|>\n`;
      }
    }
    prompt += `<|assistant|>\n`;

    console.debug("[WebAI] prompt", {
      length: prompt.length,
      preview: prompt.substring(0, 150),
    });

    const t0 = Date.now();
    let result: any;
    try {
      // 20s timeout to prevent lockups
      result = await Promise.race([
        pipeline(prompt, {
          max_new_tokens: Math.min(80, opts?.maxTokens ?? 80),
          temperature: opts?.temperature ?? 0.7, // Balanced temperature
          do_sample: true,
          return_full_text: false, // Only return generated part, not the prompt
          top_p: 0.9, // Nucleus sampling for better quality
          repetition_penalty: 1.1, // Prevent repetition
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("generation timeout")), 20_000),
        ),
      ]);
    } catch (e) {
      console.error("[WebAI] generate: pipeline error", e);
      throw e;
    }

    const text = result?.[0]?.generated_text ?? "";
    if (!text) {
      console.error("[WebAI] generate: empty response");
      throw new Error("Empty response from WebAI");
    }

    console.debug("[WebAI] raw response", { text: text.substring(0, 200) });

    // Clean up: remove template markers and trim
    let out = text.trim();
    out = out.replace(/<\|end\|>/g, "").trim();
    out = out.replace(/<\|assistant\|>/g, "").trim();
    out = out.replace(/<\|user\|>/g, "").trim();
    out = out.replace(/<\|system\|>/g, "").trim();

    // Remove quotes if wrapped
    out = out.replace(/^["']|["']$/g, "").trim();

    // Extract first 1-2 sentences if response is too long
    const sentences = out.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      out = sentences.slice(0, 2).join(" ").trim();
    }

    // Ensure minimum length
    if (out.length < 5) {
      console.warn("[WebAI] response too short, using raw text");
      out = text.trim();
    }

    console.info("[WebAI] generate: done", {
      ms: Date.now() - t0,
      length: out.length,
      preview: out.substring(0, 100),
    });
    return out;
  },

  async unload(): Promise<void> {
    // Transformers.js doesn't expose explicit unload; nullify reference
    pipeline = null;
    currentModelId = undefined;
  },

  async removeStorage(): Promise<boolean> {
    // Transformers.js uses browser Cache API; clear it
    if (typeof caches === "undefined") return false;
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      return true;
    } catch {
      return false;
    }
  },

  getStatus(): WebAIStatus {
    const support = checkSupport();
    return {
      initialized: !!pipeline,
      modelId: currentModelId,
      supported: support.supported,
      reason: support.reason,
    };
  },
};
