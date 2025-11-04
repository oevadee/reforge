'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { MainContent } from '@/components/MainContent';
import { Button } from '@/components/forms/Button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage(): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MainContent>
      <Hero>
        <HeroContent>
          <Title>
            Build Better Habits with
            <br />
            <Highlight>AI-Powered Insights</Highlight>
          </Title>
          <Subtitle>
            Track your daily habits, reflect on your progress, and receive personalized
            coaching from AI to help you become your best self.
          </Subtitle>
          <CTAButtons>
            <Link href="/auth/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </CTAButtons>
        </HeroContent>

        <Features>
          <Feature>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Track Habits</FeatureTitle>
            <FeatureDescription>
              Log daily habits, track streaks, and visualize your progress over time.
            </FeatureDescription>
          </Feature>

          <Feature>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI Coach</FeatureTitle>
            <FeatureDescription>
              Get personalized insights and motivational messages powered by AI.
            </FeatureDescription>
          </Feature>

          <Feature>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>Daily Reflections</FeatureTitle>
            <FeatureDescription>
              Track your mood and write reflections to understand patterns better.
            </FeatureDescription>
          </Feature>
        </Features>
      </Hero>
    </MainContent>
  );
}

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const Feature = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
