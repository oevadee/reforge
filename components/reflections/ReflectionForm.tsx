"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { MoodLevel } from "@prisma/client";
import { MoodSelector } from "./MoodSelector";
import { Button } from "@/components/forms/Button";
import { CreateReflectionDto } from "@/types/reflections";

interface ReflectionFormProps {
  date: string;
  initialMood?: MoodLevel | null;
  initialContent?: string;
  onSubmit: (data: CreateReflectionDto) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ReflectionForm({
  date,
  initialMood = null,
  initialContent = "",
  onSubmit,
  onCancel,
  isLoading,
}: ReflectionFormProps): React.JSX.Element {
  const [mood, setMood] = useState<MoodLevel | null>(initialMood);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!mood && !content.trim()) {
      setError("Please select a mood or write a reflection");
      return;
    }

    try {
      await onSubmit({
        date,
        mood: mood || undefined,
        content: content.trim() || undefined,
      });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to save reflection");
    }
  };

  const characterCount = content.length;
  const maxCharacters = 2000;

  return (
    <Form onSubmit={handleSubmit}>
      <MoodSelector value={mood} onChange={setMood} disabled={isLoading} />

      <TextAreaContainer>
        <Label>Reflection (optional)</Label>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How was your day? What did you accomplish? What could be improved?"
          maxLength={maxCharacters}
          rows={6}
          disabled={isLoading}
        />
        <CharacterCount>
          {characterCount} / {maxCharacters}
        </CharacterCount>
      </TextAreaContainer>

      {error && <ErrorText>{error}</ErrorText>}

      <Actions>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          Save Reflection
        </Button>
      </Actions>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  resize: vertical;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const CharacterCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: right;
`;

const ErrorText = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error}15;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;
