import React from 'react';
import styled from '@emotion/styled';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyStats } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const ChartContainer = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.lg};
    padding: ${props => props.theme.spacing.md};
    box-shadow: ${props => props.theme.shadows.md};
    
    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl};
    }
`;

const ChartTitle = styled.h3<{ theme: any }>`
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 8px;
    
    @media (min-width: 768px) {
        margin: 0 0 24px 0;
        font-size: 20px;
        gap: 12px;
    }
`;

const ChartSubtitle = styled.p<{ theme: any }>`
    margin: 0 0 16px 0;
    color: ${props => props.theme.colors.text.secondary};
    font-size: 12px;
    
    @media (min-width: 768px) {
        margin: 0 0 24px 0;
        font-size: 14px;
    }
`;

const ChartWrapper = styled.div`
    width: 100%;
    height: 250px;
    
    @media (min-width: 480px) {
        height: 280px;
    }
    
    @media (min-width: 768px) {
        height: 300px;
    }
    
    @media (min-width: 1024px) {
        height: 320px;
    }
`;

const Legend = styled.div<{ theme: any }>`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 12px;
    font-size: 11px;
    
    @media (min-width: 768px) {
        gap: 16px;
        margin-top: 16px;
        font-size: 12px;
    }
`;

const LegendItem = styled.div<{ color: string; theme: any }>`
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${props => props.theme.colors.text.secondary};
    
    &::before {
        content: '';
        width: 12px;
        height: 2px;
        background: ${props => props.color};
        border-radius: 1px;
    }
    
    @media (min-width: 768px) {
        gap: 8px;
        
        &::before {
            width: 16px;
            height: 3px;
        }
    }
`;

interface CompletionChartProps {
    data: DailyStats[];
}

export const CompletionChart: React.FC<CompletionChartProps> = ({ data }) => {
    const { theme } = useTheme();

    // Prepare data for chart - show different amounts based on screen size
    const getChartData = () => {
        const isSmallScreen = window.innerWidth < 768;
        const isTinyScreen = window.innerWidth < 480;
        const dataPoints = isTinyScreen ? 10 : isSmallScreen ? 14 : 30;
        
        return data.slice(-dataPoints).map(day => {
            const date = new Date(day.date);
            return {
                ...day,
                date: isTinyScreen 
                    ? date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) // "12/25"
                    : isSmallScreen 
                    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) // "Dec 25"
                    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) // "Dec 25"
            };
        });
    };

    const [chartData, setChartData] = React.useState(getChartData());

    React.useEffect(() => {
        const handleResize = () => {
            setChartData(getChartData());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [data]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.sm,
                    padding: '8px 12px',
                    boxShadow: theme.shadows.lg,
                    fontSize: '11px',
                    maxWidth: '200px'
                }}>
                    <p style={{ 
                        margin: '0 0 6px 0', 
                        fontWeight: 600, 
                        color: theme.colors.text.primary,
                        fontSize: '12px'
                    }}>
                        {label}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <p style={{ margin: 0, color: theme.colors.primary, display: 'flex', justifyContent: 'space-between' }}>
                            <span>Created:</span>
                            <strong>{payload[0]?.value || 0}</strong>
                        </p>
                        <p style={{ margin: 0, color: '#10b981', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Completed:</span>
                            <strong>{payload[1]?.value || 0}</strong>
                        </p>
                        <p style={{ margin: 0, color: '#f59e0b', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Rate:</span>
                            <strong>{payload[2]?.value || 0}%</strong>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Responsive chart configuration
    const getChartMargin = () => {
        const isSmallScreen = window.innerWidth < 768;
        return isSmallScreen 
            ? { top: 5, right: 10, left: 0, bottom: 25 }
            : { top: 5, right: 30, left: 20, bottom: 5 };
    };

    const getAxisConfig = () => {
        const isSmallScreen = window.innerWidth < 768;
        const isTinyScreen = window.innerWidth < 480;
        return {
            fontSize: isTinyScreen ? 8 : isSmallScreen ? 9 : 12,
            interval: isTinyScreen ? 2 : isSmallScreen ? 1 : 0, // Show fewer labels on smaller screens
            angle: isSmallScreen ? -45 : 0, // Rotate labels on mobile
        };
    };

    return (
        <ChartContainer theme={theme}>
            <ChartTitle theme={theme}>
                📈 Daily Task Completion
            </ChartTitle>
            <ChartSubtitle theme={theme}>
                Track your daily task creation and completion patterns
            </ChartSubtitle>
            
            <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={getChartMargin()}>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={theme.colors.border} 
                            strokeOpacity={0.5}
                        />
                        <XAxis 
                            dataKey="date" 
                            stroke={theme.colors.text.secondary}
                            fontSize={getAxisConfig().fontSize}
                            interval={getAxisConfig().interval}
                            angle={getAxisConfig().angle}
                            textAnchor={getAxisConfig().angle ? "end" : "middle"}
                            tick={{ fontSize: getAxisConfig().fontSize }}
                            axisLine={{ stroke: theme.colors.border }}
                            tickLine={{ stroke: theme.colors.border }}
                            height={window.innerWidth < 768 ? 50 : 30}
                        />
                        <YAxis 
                            stroke={theme.colors.text.secondary}
                            fontSize={getAxisConfig().fontSize}
                            tick={{ fontSize: getAxisConfig().fontSize }}
                            axisLine={{ stroke: theme.colors.border }}
                            tickLine={{ stroke: theme.colors.border }}
                            width={window.innerWidth < 768 ? 30 : 40}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                            type="monotone" 
                            dataKey="tasksCreated" 
                            stroke={theme.colors.primary} 
                            strokeWidth={window.innerWidth < 768 ? 2 : 3}
                            dot={{ fill: theme.colors.primary, strokeWidth: 2, r: window.innerWidth < 768 ? 3 : 4 }}
                            activeDot={{ r: window.innerWidth < 768 ? 5 : 6, stroke: theme.colors.primary, strokeWidth: 2 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="tasksCompleted" 
                            stroke="#10b981" 
                            strokeWidth={window.innerWidth < 768 ? 2 : 3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: window.innerWidth < 768 ? 3 : 4 }}
                            activeDot={{ r: window.innerWidth < 768 ? 5 : 6, stroke: '#10b981', strokeWidth: 2 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="completionRate" 
                            stroke="#f59e0b" 
                            strokeWidth={window.innerWidth < 768 ? 2 : 3}
                            strokeDasharray="5 5"
                            dot={{ fill: '#f59e0b', strokeWidth: 2, r: window.innerWidth < 768 ? 2 : 3 }}
                            activeDot={{ r: window.innerWidth < 768 ? 4 : 5, stroke: '#f59e0b', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>

            <Legend theme={theme}>
                <LegendItem color={theme.colors.primary} theme={theme}>
                    Tasks Created
                </LegendItem>
                <LegendItem color="#10b981" theme={theme}>
                    Tasks Completed
                </LegendItem>
                <LegendItem color="#f59e0b" theme={theme}>
                    Completion Rate %
                </LegendItem>
            </Legend>
        </ChartContainer>
    );
}; 