"use client";

import styled from "@emotion/styled";
import { signIn } from "next-auth/react";
import { Button } from "./forms/Button";
import { useState } from "react";

export function DemoLogin(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signIn("credentials", {
        email: "demo@reforge.app",
        password: "demo123",
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Demo login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <InfoBox>
        <InfoIcon>ℹ️</InfoIcon>
        <InfoText>
          Try Reforge without signing up! Explore with pre-populated demo data.
        </InfoText>
      </InfoBox>
      <Button
        onClick={handleDemoLogin}
        variant="outline"
        fullWidth
        isLoading={isLoading}
      >
        🎯 Try Demo Account
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.info}15;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.info}40;
`;

const InfoIcon = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  margin: 0;
`;
