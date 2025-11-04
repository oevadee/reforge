"use client";

import styled from "@emotion/styled";
import { RecentActivityItem } from "@/types/dashboard";
import { formatDate } from "@/lib/utils/date";

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export function RecentActivity({
  activities,
}: RecentActivityProps): React.JSX.Element {
  if (activities.length === 0) {
    return (
      <Container>
        <Title>Recent Activity</Title>
        <EmptyState>
          <EmptyText>No recent activity</EmptyText>
          <EmptySubtext>
            Start logging your habits to see activity here
          </EmptySubtext>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Recent Activity</Title>
      <ActivityList>
        {activities.map((activity) => (
          <ActivityItem key={activity.id}>
            <IconContainer $color={activity.habitColor || "#6366f1"}>
              <Icon>{activity.habitIcon || "✓"}</Icon>
            </IconContainer>
            <ActivityContent>
              <ActivityName>{activity.habitName}</ActivityName>
              <ActivityDate>{formatDate(activity.date, "short")}</ActivityDate>
            </ActivityContent>
            <StatusBadge $status={activity.status}>
              {activity.status === "COMPLETED"
                ? "✓ Done"
                : activity.status === "SKIPPED"
                  ? "→ Skipped"
                  : "✗ Failed"}
            </StatusBadge>
          </ActivityItem>
        ))}
      </ActivityList>
    </Container>
  );
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const IconContainer = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $color }) => $color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Icon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActivityDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

const StatusBadge = styled.div<{
  $status: RecentActivityItem["status"];
}>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme, $status }) =>
    $status === "COMPLETED"
      ? theme.colors.success + "20"
      : $status === "SKIPPED"
        ? theme.colors.warning + "20"
        : theme.colors.error + "20"};
  color: ${({ theme, $status }) =>
    $status === "COMPLETED"
      ? theme.colors.success
      : $status === "SKIPPED"
        ? theme.colors.warning
        : theme.colors.error};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl}
    ${({ theme }) => theme.spacing.xl};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EmptySubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.disabled};
  margin: 0;
`;
