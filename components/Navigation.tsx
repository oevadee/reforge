"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "./ThemeProvider";
import { Theme } from "@/types/theme";

interface NavItem {
  label: string;
  href: string;
  requireAuth: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", requireAuth: true },
  { label: "My Habits", href: "/habits", requireAuth: true },
  { label: "Check-In", href: "/check-in", requireAuth: true },
  { label: "Reflections", href: "/reflections", requireAuth: true },
];

export function Navigation(): React.JSX.Element {
  const { user, isAuthenticated, signOut } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => {
    // Hide dashboard link when authenticated (logo serves as dashboard link)
    if (item.href === "/dashboard" && isAuthenticated) {
      return false;
    }
    if (item.requireAuth) {
      return isAuthenticated;
    }
    return true;
  });

  const handleSignOut = async (): Promise<void> => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Nav>
      <Container>
        <Logo>
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <LogoText>🔥 Reforge</LogoText>
          </Link>
        </Logo>

        <NavLinks>
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <NavLinkWrapper key={item.href} $isActive={isActive}>
                <Link href={item.href}>{item.label}</Link>
              </NavLinkWrapper>
            );
          })}
        </NavLinks>

        <Actions>
          <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
            {mode === "light" ? "🌙" : "☀️"}
          </ThemeToggle>

          {isAuthenticated ? (
            <>
              <UserInfo>{user?.name ?? user?.email}</UserInfo>
              <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <AuthButton>Sign In</AuthButton>
              </Link>
              <Link href="/auth/signup">
                <AuthButton $primary>Sign Up</AuthButton>
              </Link>
            </>
          )}
        </Actions>
      </Container>
    </Nav>
  );
}

// Styled Components

const Nav = styled.nav`
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled.div`
  flex-shrink: 0;

  a {
    text-decoration: none;
  }
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    order: 3;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const NavLinkWrapper = styled.div<{ $isActive: boolean }>`
  a {
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : theme.colors.text.secondary};
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.surfaceHover : "transparent"};
    transition: all ${({ theme }) => theme.transitions.fast};
    text-decoration: none;
    display: block;

    &:hover {
      background-color: ${({ theme }) => theme.colors.surfaceHover};
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }

  @media (max-width: 768px) {
    a {
      padding: ${({ theme }) => theme.spacing.xs}
        ${({ theme }) => theme.spacing.sm};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
  }
`;

const UserInfo = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SignOutButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const AuthButton = styled.button<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: ${({ theme, $primary }) =>
    $primary ? "none" : `1px solid ${theme.colors.border}`};
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : "transparent"};
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.text.inverse : theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme, $primary }) =>
      $primary ? theme.colors.primaryHover : theme.colors.surfaceHover};
    color: ${({ theme, $primary }) =>
      $primary ? theme.colors.text.inverse : theme.colors.text.primary};
  }
`;
