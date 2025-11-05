"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { Button } from "@/components/forms/Button";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => Promise<void>;
}

export function OnboardingModal({
  isOpen,
  onComplete,
}: OnboardingModalProps): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = async (): Promise<void> => {
    if (isLastStep) {
      setIsCompleting(true);
      await onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <ProgressBar>
              {ONBOARDING_STEPS.map((_, index) => (
                <ProgressDot
                  key={index}
                  $isActive={index === currentStep}
                  $isComplete={index < currentStep}
                />
              ))}
            </ProgressBar>

            <Content>
              <Icon>{step.icon}</Icon>
              <Title>{step.title}</Title>
              <Description>{step.description}</Description>
            </Content>

            <Actions>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                isLoading={isCompleting}
                fullWidth={currentStep === 0}
              >
                {isLastStep ? "Get Started 🎉" : "Next"}
              </Button>
            </Actions>

            <StepCounter>
              {currentStep + 1} of {ONBOARDING_STEPS.length}
            </StepCounter>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Modal = styled(motion.div)`
  max-width: 500px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ProgressBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProgressDot = styled.div<{ $isActive: boolean; $isComplete: boolean }>`
  flex: 1;
  height: 4px;
  background-color: ${({ theme, $isActive, $isComplete }) =>
    $isComplete || $isActive
      ? theme.colors.primary
      : theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: background-color ${({ theme }) => theme.transitions.fast};
`;

const Content = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin-top: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepCounter = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.disabled};
`;
