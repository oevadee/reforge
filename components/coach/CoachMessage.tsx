"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import { Theme } from "@/types/theme";

interface CoachMessageProps {
  title: string;
  content: string;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  onGenerate?: () => Promise<void>;
}

export function CoachMessage({
  title,
  content,
  isLoading,
  onRefresh,
  onGenerate,
}: CoachMessageProps): React.JSX.Element {
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleRefresh = async (): Promise<void> => {
    if (!onRefresh || refreshing) return;

    try {
      setRefreshing(true);
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerate = async (): Promise<void> => {
    if (!onGenerate || generating) return;

    try {
      setGenerating(true);
      await onGenerate();
    } finally {
      setGenerating(false);
    }
  };

  const isPlaceholder =
    content.includes("Enable AI in Settings") ||
    content.includes("AI insights are off") ||
    content.includes("Unable to load");

  return (
    <Card>
      <Header>
        <Icon>🤖</Icon>
        <Title>{title}</Title>
        {onRefresh && !isPlaceholder && (
          <RefreshButton
            onClick={handleRefresh}
            disabled={isLoading || refreshing}
          >
            {refreshing ? "..." : "↻"}
          </RefreshButton>
        )}
      </Header>

      <Content>
        {isLoading || generating ? (
          <LoadingText>
            {generating ? "Generating with on-device AI..." : "Loading..."}
          </LoadingText>
        ) : (
          <>
            <Message>{content}</Message>
            {isPlaceholder && onGenerate && (
              <GenerateButton onClick={handleGenerate} disabled={generating}>
                ✨ Generate Now
              </GenerateButton>
            )}
          </>
        )}
      </Content>
    </Card>
  );
}

const Card = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }: { theme: Theme }) => theme.colors.primary}15,
    ${({ theme }: { theme: Theme }) => theme.colors.secondary}15
  );
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Icon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
`;

const Title = styled.h3`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const RefreshButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    transform: rotate(180deg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  min-height: 60px;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  margin: 0;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  white-space: pre-wrap;
  margin: 0;
`;

const GenerateButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
