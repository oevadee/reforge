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

export const WebAI = {
  async initialize(options: InitOptions = {}): Promise<WebAIStatus> {
    const support = checkSupport();
    if (!support.supported) {
      return { initialized: false, supported: false, reason: support.reason };
    }

    const modelId = options.modelId ?? "Xenova/Phi-3-mini-4k-instruct";

    if (pipeline && currentModelId === modelId) {
      return { initialized: true, supported: true, modelId: currentModelId };
    }

    // Dynamic import to avoid bundling in server
    const { pipeline: createPipeline, env } = await import(
      "@huggingface/transformers"
    );

    // Use local cache; set progress callback
    env.allowLocalModels = false;
    env.allowRemoteModels = true;

    // Progress tracking via callback
    if (options.onProgress) {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
        const response = await originalFetch(...args);
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
              options.onProgress?.({
                loaded,
                total: contentLength,
                percent:
                  contentLength > 0
                    ? Math.round((loaded / contentLength) * 100)
                    : 0,
              });
              controller.enqueue(value);
            }
            controller.close();
          },
        });

        return new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
      };
    }

    pipeline = await createPipeline("text-generation", modelId, {
      quantized: true,
    });

    currentModelId = modelId;
    return { initialized: true, supported: true, modelId: currentModelId };
  },

  async generate(
    messages: WebAIMessage[],
    opts?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    if (!pipeline)
      throw new Error("WebAI not initialized. Call initialize() first.");

    // Convert messages to a single prompt (Phi-3 uses chat template internally)
    const prompt =
      messages.map((m) => `${m.role}: ${m.content}`).join("\n") +
      "\nassistant:";

    const result = await pipeline(prompt, {
      max_new_tokens: opts?.maxTokens ?? 512,
      temperature: opts?.temperature ?? 0.7,
      do_sample: true,
    });

    const text = result?.[0]?.generated_text ?? "";
    if (!text) throw new Error("Empty response from WebAI");
    return text.replace(prompt, "").trim();
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
