"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { MainContent } from "@/components/MainContent";
import { settingsApi } from "@/lib/api/settings";
import { UserSettings } from "@/types/settings";
import { WebAI } from "@/lib/webai/client";

export default function SettingsPage(): React.JSX.Element {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [initError, setInitError] = useState<string>("");
  const [webAIStatus, setWebAIStatus] = useState(WebAI.getStatus());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await settingsApi.get();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAI = async (): Promise<void> => {
    if (!settings) return;

    // Turning ON: need to initialize WebAI first
    if (!settings.aiEnabled) {
      const status = WebAI.getStatus();
      if (!status.supported) {
        setInitError(
          "Your browser doesn't support on-device AI. Please use a modern browser with WebAssembly support.",
        );
        return;
      }

      try {
        setIsInitializing(true);
        setInitError("");
        setDownloadProgress(0);

        const result = await WebAI.initialize({
          onProgress: (progress) => {
            setDownloadProgress(progress.percent);
          },
        });

        if (!result.initialized) {
          setInitError("Failed to initialize AI model. Please try again.");
          return;
        }

        setWebAIStatus(WebAI.getStatus());

        // Save to server
        setIsSaving(true);
        const updated = await settingsApi.update({ aiEnabled: true });
        setSettings(updated);
      } catch (error: any) {
        console.error("Failed to initialize AI:", error);
        setInitError(error.message || "Failed to initialize AI model");
      } finally {
        setIsInitializing(false);
        setIsSaving(false);
      }
    } else {
      // Turning OFF: just save
      try {
        setIsSaving(true);
        const updated = await settingsApi.update({ aiEnabled: false });
        setSettings(updated);
      } catch (error) {
        console.error("Failed to update settings:", error);
        alert("Failed to save settings");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <MainContent>
        <div>Loading...</div>
      </MainContent>
    );
  }

  return (
    <MainContent maxWidth="md">
      <Title>Settings</Title>

      <Section>
        <SectionTitle>AI Coach</SectionTitle>
        <SectionDescription>
          Enable or disable AI-powered insights and motivational messages.
          {!webAIStatus.supported && (
            <WarningText>
              ⚠️ Your browser doesn't support on-device AI
            </WarningText>
          )}
        </SectionDescription>

        <SettingRow>
          <SettingInfo>
            <SettingLabel>Enable AI Coach</SettingLabel>
            <SettingSubtext>
              Get personalized summaries, motivation, and insights powered by AI
            </SettingSubtext>
            {webAIStatus.initialized && webAIStatus.modelId && (
              <ModelInfo>Model: {webAIStatus.modelId}</ModelInfo>
            )}
          </SettingInfo>

          <Toggle
            $enabled={settings?.aiEnabled || false}
            onClick={handleToggleAI}
            disabled={isSaving || isInitializing || !webAIStatus.supported}
          >
            <ToggleSlider $enabled={settings?.aiEnabled || false} />
          </Toggle>
        </SettingRow>

        {isInitializing && (
          <ProgressContainer>
            <ProgressLabel>
              Downloading AI model... {downloadProgress}%
            </ProgressLabel>
            <ProgressBar>
              <ProgressFill $percent={downloadProgress} />
            </ProgressBar>
            <ProgressSubtext>
              This may take a few minutes. The model (~400MB) will be cached for
              future use.
            </ProgressSubtext>
          </ProgressContainer>
        )}

        {initError && <ErrorText>{initError}</ErrorText>}
      </Section>
    </MainContent>
  );
}

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SettingSubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Toggle = styled.button<{ $enabled: boolean }>`
  position: relative;
  width: 56px;
  height: 32px;
  background-color: ${({ theme, $enabled }) =>
    $enabled ? theme.colors.success : theme.colors.surfaceHover};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToggleSlider = styled.div<{ $enabled: boolean }>`
  position: absolute;
  top: 4px;
  left: ${({ $enabled }) => ($enabled ? "28px" : "4px")};
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.text.inverse};
  border-radius: 50%;
  transition: left ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const WarningText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ModelInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: monospace;
`;

const ProgressContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ProgressLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const ProgressSubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
