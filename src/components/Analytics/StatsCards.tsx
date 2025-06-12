import React from 'react';
import styled from '@emotion/styled';
import { AnalyticsData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const CardsContainer = styled.div<{ theme: any }>`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.md};
    
    /* Mobile Large - 2 columns */
    @media (min-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
        gap: ${props => props.theme.spacing.lg};
    }
    
    /* Tablet - 3 columns */
    @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: ${props => props.theme.spacing.lg};
    }
    
    /* Desktop - up to 4 columns */
    @media (min-width: 1200px) {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: ${props => props.theme.spacing.xl};
    }
`;

const StatCard = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.lg};
    padding: ${props => props.theme.spacing.lg};
    box-shadow: ${props => props.theme.shadows.md};
    transition: all ${props => props.theme.transitions.medium};
    position: relative;
    overflow: hidden;
    min-height: 140px;
    
    /* Mobile optimizations */
    @media (max-width: 479px) {
        padding: ${props => props.theme.spacing.md};
        min-height: 120px;
    }
    
    /* Tablet and up */
    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl};
        min-height: 160px;
        
        &:hover {
            transform: translateY(-4px);
            box-shadow: ${props => props.theme.shadows.lg};
            border-color: ${props => props.theme.colors.primary};
        }
    }
    
    /* Remove hover effects on touch devices */
    @media (hover: none) {
        &:hover {
            transform: none;
            box-shadow: ${props => props.theme.shadows.md};
            border-color: ${props => props.theme.colors.border};
        }
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
    
    @media (min-width: 768px) {
        margin-bottom: 16px;
        align-items: center;
    }
`;

const CardContent = styled.div`
    flex: 1;
    min-width: 0; /* Allow content to shrink */
`;

const CardIcon = styled.div<{ theme: any }>`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
    
    @media (min-width: 768px) {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        font-size: 24px;
    }
`;

const CardTitle = styled.h3<{ theme: any }>`
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 4px 0;
    
    @media (min-width: 768px) {
        font-size: 14px;
        margin: 0 0 6px 0;
    }
`;

const CardValue = styled.div<{ theme: any }>`
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.colors.text.primary};
    margin: 4px 0 6px 0;
    line-height: 1;
    
    @media (min-width: 480px) {
        font-size: 32px;
        margin: 6px 0 8px 0;
    }
    
    @media (min-width: 768px) {
        font-size: 36px;
        margin: 8px 0;
    }
`;

const CardSubtitle = styled.div<{ theme: any }>`
    font-size: 12px;
    color: ${props => props.theme.colors.text.secondary};
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    
    @media (min-width: 768px) {
        font-size: 14px;
        gap: 8px;
    }
`;

const Badge = styled.span<{ color: string; theme: any }>`
    background: ${props => props.color}20;
    color: ${props => props.color};
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    
    @media (min-width: 768px) {
        padding: 4px 8px;
        font-size: 12px;
    }
`;

const ProgressBar = styled.div<{ theme: any }>`
    width: 100%;
    height: 6px;
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    overflow: hidden;
    margin: 8px 0 4px 0;
    
    @media (min-width: 768px) {
        height: 8px;
        border-radius: 4px;
        margin: 12px 0 8px 0;
    }
`;

const ProgressFill = styled.div<{ percentage: number; color: string }>`
    height: 100%;
    background: ${props => props.color};
    width: ${props => props.percentage}%;
    transition: width 0.6s ease;
    border-radius: inherit;
`;

interface StatsCardsProps {
    data: AnalyticsData;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
    const { theme } = useTheme();

    const getCompletionColor = (rate: number) => {
        if (rate >= 80) return '#10b981'; // Green
        if (rate >= 60) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#3b82f6';
        if (score >= 40) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <CardsContainer theme={theme}>
            <StatCard theme={theme}>
                <CardHeader>
                    <CardContent>
                        <CardTitle theme={theme}>Total Tasks</CardTitle>
                        <CardValue theme={theme}>{data.completionStats.totalTasks}</CardValue>
                        <CardSubtitle theme={theme}>
                            <Badge color="#3b82f6" theme={theme}>
                                {data.averageTasksPerDay} per day
                            </Badge>
                        </CardSubtitle>
                    </CardContent>
                    <CardIcon theme={theme}>📋</CardIcon>
                </CardHeader>
            </StatCard>

            <StatCard theme={theme}>
                <CardHeader>
                    <CardContent>
                        <CardTitle theme={theme}>Completed Tasks</CardTitle>
                        <CardValue theme={theme}>{data.completionStats.completedTasks}</CardValue>
                        <CardSubtitle theme={theme}>
                            <Badge color={getCompletionColor(data.completionStats.completionRate)} theme={theme}>
                                {data.completionStats.completionRate}% completion
                            </Badge>
                        </CardSubtitle>
                    </CardContent>
                    <CardIcon theme={theme}>✅</CardIcon>
                </CardHeader>
                <ProgressBar theme={theme}>
                    <ProgressFill 
                        percentage={data.completionStats.completionRate} 
                        color={getCompletionColor(data.completionStats.completionRate)}
                    />
                </ProgressBar>
            </StatCard>

            <StatCard theme={theme}>
                <CardHeader>
                    <CardContent>
                        <CardTitle theme={theme}>Current Streak</CardTitle>
                        <CardValue theme={theme}>{data.streakData.currentStreak}</CardValue>
                        <CardSubtitle theme={theme}>
                            <Badge color="#f59e0b" theme={theme}>
                                Best: {data.streakData.longestStreak} days
                            </Badge>
                        </CardSubtitle>
                    </CardContent>
                    <CardIcon theme={theme}>🔥</CardIcon>
                </CardHeader>
            </StatCard>

            <StatCard theme={theme}>
                <CardHeader>
                    <CardContent>
                        <CardTitle theme={theme}>Productivity Score</CardTitle>
                        <CardValue theme={theme}>{data.productivityScore}</CardValue>
                        <CardSubtitle theme={theme}>
                            <Badge color={getScoreColor(data.productivityScore)} theme={theme}>
                                {data.productivityScore >= 80 ? 'Excellent' :
                                 data.productivityScore >= 60 ? 'Good' :
                                 data.productivityScore >= 40 ? 'Average' : 'Needs Improvement'}
                            </Badge>
                        </CardSubtitle>
                    </CardContent>
                    <CardIcon theme={theme}>⭐</CardIcon>
                </CardHeader>
                <ProgressBar theme={theme}>
                    <ProgressFill 
                        percentage={data.productivityScore} 
                        color={getScoreColor(data.productivityScore)}
                    />
                </ProgressBar>
            </StatCard>

            {data.completionStats.overdueTasks > 0 && (
                <StatCard theme={theme}>
                    <CardHeader>
                        <CardContent>
                            <CardTitle theme={theme}>Overdue Tasks</CardTitle>
                            <CardValue theme={theme}>{data.completionStats.overdueTasks}</CardValue>
                            <CardSubtitle theme={theme}>
                                <Badge color="#ef4444" theme={theme}>
                                    Needs attention
                                </Badge>
                            </CardSubtitle>
                        </CardContent>
                        <CardIcon theme={theme}>⚠️</CardIcon>
                    </CardHeader>
                </StatCard>
            )}
        </CardsContainer>
    );
}; 