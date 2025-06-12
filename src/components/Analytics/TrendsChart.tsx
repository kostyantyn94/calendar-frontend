import React from 'react';
import styled from '@emotion/styled';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeeklyStats } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const ChartContainer = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.lg};
    padding: ${props => props.theme.spacing.xl};
    box-shadow: ${props => props.theme.shadows.md};
`;

const ChartTitle = styled.h3<{ theme: any }>`
    margin: 0 0 24px 0;
    font-size: 20px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 12px;
`;

interface TrendsChartProps {
    data: WeeklyStats[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ data }) => {
    const { theme } = useTheme();

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.sm,
                    padding: theme.spacing.sm,
                    boxShadow: theme.shadows.md
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: theme.colors.text.primary }}>
                        {label}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: theme.colors.primary }}>
                        Created: {payload[0]?.value || 0}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#10b981' }}>
                        Completed: {payload[1]?.value || 0}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ChartContainer theme={theme}>
            <ChartTitle theme={theme}>
                📊 Weekly Trends
            </ChartTitle>
            
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                    <XAxis 
                        dataKey="week" 
                        stroke={theme.colors.text.secondary}
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis 
                        stroke={theme.colors.text.secondary}
                        fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                        dataKey="tasksCreated" 
                        fill={theme.colors.primary} 
                        name="Created"
                        radius={[2, 2, 0, 0]}
                    />
                    <Bar 
                        dataKey="tasksCompleted" 
                        fill="#10b981" 
                        name="Completed"
                        radius={[2, 2, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}; 