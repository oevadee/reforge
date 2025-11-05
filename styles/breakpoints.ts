export const BREAKPOINTS = {
  mobile: "768px",
  tablet: "1024px",
  desktop: "1280px",
} as const;

export const mediaQueries = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile})`,
  tablet: `@media (min-width: ${BREAKPOINTS.mobile}) and (max-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop})`,
} as const;
