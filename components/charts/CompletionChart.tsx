"use client";

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CompletionDataPoint } from "@/types/charts";

interface CompletionChartProps {
  data: CompletionDataPoint[];
}

export function CompletionChart({
  data,
}: CompletionChartProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <Container>
      <Title>Completion Trend (Last 30 Days)</Title>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.colors.border}
              opacity={0.3}
            />
            <XAxis
              dataKey="formattedDate"
              stroke={theme.colors.text.secondary}
              fontSize={12}
              tick={{ fill: theme.colors.text.secondary }}
            />
            <YAxis
              stroke={theme.colors.text.secondary}
              fontSize={12}
              tick={{ fill: theme.colors.text.secondary }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text.primary,
              }}
              labelStyle={{
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={theme.colors.primary}
              strokeWidth={2}
              dot={{ fill: theme.colors.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
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

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;
