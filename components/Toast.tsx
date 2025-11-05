"use client";

import { createContext, useContext, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastContextValue {
  showToast: (type: Toast["type"], message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              $type={toast.type}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <ToastIcon>
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "✗"}
                {toast.type === "info" && "ℹ"}
              </ToastIcon>
              <ToastMessage>{toast.message}</ToastMessage>
            </ToastItem>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const ToastContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToastItem = styled(motion.div)<{ $type: Toast["type"] }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme, $type }) =>
    $type === "success"
      ? theme.colors.success
      : $type === "error"
        ? theme.colors.error
        : theme.colors.info};
  color: ${({ theme }) => theme.colors.text.inverse};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 300px;
`;

const ToastIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ToastMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
