import React from 'react';
import styled from '@emotion/styled';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PriorityStats } from '../../types';
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

interface PriorityChartProps {
    data: PriorityStats[];
}

const PRIORITY_COLORS = {
    low: '#10b981',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444'
};

export const PriorityChart: React.FC<PriorityChartProps> = ({ data }) => {
    const { theme } = useTheme();

    const chartData = data.filter(item => item.total > 0).map(item => ({
        name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
        value: item.total,
        completed: item.completed,
        completionRate: item.completionRate,
        priority: item.priority
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.sm,
                    padding: theme.spacing.sm,
                    boxShadow: theme.shadows.md
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: theme.colors.text.primary }}>
                        {data.name} Priority
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: theme.colors.text.secondary }}>
                        Total: {data.value}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#10b981' }}>
                        Completed: {data.completed}
                    </p>
                    <p style={{ margin: 0, color: theme.colors.text.secondary }}>
                        Rate: {data.completionRate}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: any) => (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '16px',
            marginTop: '16px'
        }}>
            {payload.map((entry: any, index: number) => (
                <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontSize: '14px',
                    color: theme.colors.text.secondary
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: entry.color
                    }} />
                    <span>{entry.value}</span>
                </div>
            ))}
        </div>
    );

    return (
        <ChartContainer theme={theme}>
            <ChartTitle theme={theme}>
                🎯 Tasks by Priority
            </ChartTitle>
            
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS]} 
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}; 