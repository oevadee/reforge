"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { MainContent } from "@/components/MainContent";
import { settingsApi } from "@/lib/api/settings";
import { UserSettings } from "@/types/settings";

export default function SettingsPage(): React.JSX.Element {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

    try {
      setIsSaving(true);
      const updated = await settingsApi.update({
        aiEnabled: !settings.aiEnabled,
      });
      setSettings(updated);
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
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
        </SectionDescription>

        <SettingRow>
          <SettingInfo>
            <SettingLabel>Enable AI Coach</SettingLabel>
            <SettingSubtext>
              Get personalized summaries, motivation, and insights powered by AI
            </SettingSubtext>
          </SettingInfo>

          <Toggle
            $enabled={settings?.aiEnabled || false}
            onClick={handleToggleAI}
            disabled={isSaving}
          >
            <ToggleSlider $enabled={settings?.aiEnabled || false} />
          </Toggle>
        </SettingRow>
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
