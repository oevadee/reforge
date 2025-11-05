"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Reflection } from "@prisma/client";
import { MainContent } from "@/components/MainContent";
import { ReflectionForm } from "@/components/reflections/ReflectionForm";
import { MoodBadge } from "@/components/reflections/MoodBadge";
import { reflectionsApi } from "@/lib/api/reflections";
import { getTodayISO, formatDate } from "@/lib/utils/date";
import { CreateReflectionDto } from "@/types/reflections";

export default function ReflectionsPage(): React.JSX.Element {
  const [todayReflection, setTodayReflection] = useState<Reflection | null>(
    null,
  );
  const [recentReflections, setRecentReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = getTodayISO();

  useEffect(() => {
    loadReflections();
  }, []);

  const loadReflections = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const [todayData, recentData] = await Promise.all([
        reflectionsApi.getByDate(today),
        reflectionsApi.getAll({ limit: 7 }),
      ]);

      setTodayReflection(todayData);
      setRecentReflections(
        recentData.filter((r) => r.date.toString() !== today),
      );
    } catch (error) {
      console.error("Failed to load reflections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreateReflectionDto): Promise<void> => {
    try {
      setIsSubmitting(true);
      await reflectionsApi.upsert(data);
      await loadReflections();
    } catch (error) {
      console.error("Failed to save reflection:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
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
    <MainContent>
      <Header>
        <Title>Daily Reflections</Title>
        <Subtitle>{formatDate(new Date(), "long")}</Subtitle>
      </Header>

      <TodaySection>
        <SectionTitle>Today's Reflection</SectionTitle>
        <FormContainer>
          <ReflectionForm
            date={today}
            initialMood={todayReflection?.mood || null}
            initialContent={todayReflection?.content || ""}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </FormContainer>
      </TodaySection>

      {recentReflections.length > 0 && (
        <RecentSection>
          <SectionTitle>Recent Reflections</SectionTitle>
          <ReflectionsList>
            {recentReflections.map((reflection) => (
              <ReflectionCard key={reflection.id}>
                <ReflectionHeader>
                  <ReflectionDate>
                    {formatDate(new Date(reflection.date), "short")}
                  </ReflectionDate>
                  {reflection.mood && (
                    <MoodBadge mood={reflection.mood} size="sm" />
                  )}
                </ReflectionHeader>
                {reflection.content && (
                  <ReflectionContent>{reflection.content}</ReflectionContent>
                )}
              </ReflectionCard>
            ))}
          </ReflectionsList>
        </RecentSection>
      )}
    </MainContent>
  );
}

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TodaySection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const RecentSection = styled.section``;

const ReflectionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ReflectionCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReflectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ReflectionDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ReflectionContent = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  white-space: pre-wrap;
`;
