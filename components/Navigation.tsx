"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "./ThemeProvider";
import { Theme } from "@/types/theme";

interface NavItem {
  label: string;
  href: string;
  requireAuth: boolean;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", requireAuth: true, icon: "📊" },
  { label: "My Habits", href: "/habits", requireAuth: true, icon: "✨" },
  { label: "Check-In", href: "/check-in", requireAuth: true, icon: "✅" },
  { label: "Reflections", href: "/reflections", requireAuth: true, icon: "📝" },
  { label: "Settings", href: "/settings", requireAuth: true, icon: "⚙️" },
];

export function Navigation(): React.JSX.Element {
  const { user, isAuthenticated, signOut } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.href === "/dashboard" && isAuthenticated) {
      return false;
    }
    if (item.requireAuth) {
      return isAuthenticated;
    }
    return true;
  });

  const handleSignOut = async (): Promise<void> => {
    setMobileMenuOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Nav>
        <Container>
          <Logo>
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <LogoText>🔥 Reforge</LogoText>
            </Link>
          </Logo>

          {/* Desktop Navigation */}
          <DesktopNavLinks>
            {visibleItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <NavLinkWrapper key={item.href} $isActive={isActive}>
                  <Link href={item.href}>{item.label}</Link>
                </NavLinkWrapper>
              );
            })}
          </DesktopNavLinks>

          {/* Desktop Actions */}
          <DesktopActions>
            <ThemeToggleBtn onClick={toggleTheme} aria-label="Toggle theme">
              {mode === "light" ? "🌙" : "☀️"}
            </ThemeToggleBtn>

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
          </DesktopActions>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            $isOpen={mobileMenuOpen}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </MobileMenuButton>
        </Container>
      </Nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Backdrop />
            </motion.div>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <MobileDrawer>
                {/* User Profile Section */}
                {isAuthenticated && (
                  <UserProfile>
                    <UserAvatar>{getInitials(user?.name)}</UserAvatar>
                    <UserDetails>
                      <UserName>{user?.name ?? "User"}</UserName>
                      <UserEmail>{user?.email}</UserEmail>
                    </UserDetails>
                  </UserProfile>
                )}

                {/* Navigation Links */}
                <MobileNavLinks>
                  {visibleItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MobileNavLink $isActive={isActive}>
                          <Link href={item.href}>
                            <MobileNavLinkContent $isActive={isActive}>
                              <NavIcon>{item.icon}</NavIcon>
                              <span>{item.label}</span>
                            </MobileNavLinkContent>
                          </Link>
                        </MobileNavLink>
                      </motion.div>
                    );
                  })}
                </MobileNavLinks>

                {/* Mobile Actions */}
                <MobileActions>
                  <ThemeToggleRow onClick={toggleTheme}>
                    <ThemeLabel>
                      <span>🎨</span>
                      <span>Theme</span>
                    </ThemeLabel>
                    <ThemeToggleSwitch $mode={mode}>
                      <ThemeSwitchIcon $mode={mode}>
                        {mode === "light" ? "☀️" : "🌙"}
                      </ThemeSwitchIcon>
                    </ThemeToggleSwitch>
                  </ThemeToggleRow>

                  {isAuthenticated ? (
                    <SignOutButtonMobile onClick={handleSignOut}>
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </SignOutButtonMobile>
                  ) : (
                    <MobileAuthButtons>
                      <Link href="/auth/signin">
                        <AuthButton onClick={() => setMobileMenuOpen(false)}>
                          Sign In
                        </AuthButton>
                      </Link>
                      <Link href="/auth/signup">
                        <AuthButton
                          $primary
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign Up
                        </AuthButton>
                      </Link>
                    </MobileAuthButtons>
                  )}
                </MobileActions>
              </MobileDrawer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Styled Components

const Nav = styled.nav`
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background-color: ${({ theme }) => theme.colors.surface}f5;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.div`
  flex-shrink: 0;
  z-index: 101;

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

const DesktopNavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinkWrapper = styled.div<{ $isActive: boolean }>`
  a {
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
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
`;

const DesktopActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ThemeToggleBtn = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.15);
  }
`;

const UserInfo = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SignOutButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme, $primary }) =>
      $primary ? theme.colors.primaryHover : theme.colors.surfaceHover};
    color: ${({ theme, $primary }) =>
      $primary ? theme.colors.text.inverse : theme.colors.text.primary};
  }
`;

// Mobile Menu Components

const MobileMenuButton = styled.button<{ $isOpen: boolean }>`
  display: none;
  position: relative;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 101;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 98;
  backdrop-filter: blur(4px);

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileDrawer = styled.div`
  position: fixed;
  top: 70px;
  right: 0;
  bottom: 0;
  width: 85%;
  max-width: 350px;
  background-color: ${({ theme }) => theme.colors.surface};
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 769px) {
    display: none;
  }
`;

const UserProfile = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}15,
    transparent
  );
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primaryHover}
  );
  color: ${({ theme }) => theme.colors.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MobileNavLinks = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
  flex: 1;
`;

const MobileNavLink = styled.div<{ $isActive: boolean }>`
  a {
    text-decoration: none;
    display: block;
  }
`;

const MobileNavLinkContent = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.text.primary};
  font-weight: ${({ theme, $isActive }) =>
    $isActive
      ? theme.typography.fontWeight.semibold
      : theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.surfaceHover : "transparent"};
  border-left: 3px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : "transparent"};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  min-height: 54px;

  &:active {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const NavIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  flex-shrink: 0;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileActions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ThemeToggleRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 54px;

  &:active {
    transform: scale(0.98);
  }
`;

const ThemeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};

  span:first-of-type {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const ThemeToggleSwitch = styled.div<{ $mode: "light" | "dark" }>`
  width: 56px;
  height: 28px;
  background-color: ${({ theme, $mode }) =>
    $mode === "dark" ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: relative;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ThemeSwitchIcon = styled.div<{ $mode: "light" | "dark" }>`
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: absolute;
  top: 2px;
  left: ${({ $mode }) => ($mode === "dark" ? "30px" : "2px")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SignOutButtonMobile = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  min-height: 54px;

  &:active {
    transform: scale(0.98);
    background-color: ${({ theme }) => theme.colors.error}10;
  }

  span:first-of-type {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  a {
    text-decoration: none;
  }

  button {
    width: 100%;
    justify-content: center;
    min-height: 48px;
  }
`;
