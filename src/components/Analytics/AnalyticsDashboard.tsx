import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { AnalyticsData } from '../../types';
import { analyticsApi } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { StatsCards } from './StatsCards';
import { CompletionChart } from './CompletionChart';
import { PriorityChart } from './PriorityChart';
import { ProductivityHeatmap } from './ProductivityHeatmap';
import { StreakDisplay } from './StreakDisplay';
import { TopCategories } from './TopCategories';
import { TrendsChart } from './TrendsChart';

const DashboardContainer = styled.div<{ theme: any }>`
    max-width: 1500px;
    margin: 0 auto;
    padding: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text.primary};
    min-height: 100vh;
    
    /* Account for fixed navigation buttons - only top padding for mobile */
    padding-top: 80px;

    @media (min-width: 480px) {
        padding: ${props => props.theme.spacing.lg};
        padding-top: 90px;
    }

    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
        padding-top: 40px;
    }
    
    @media (min-width: 1024px) {
        padding: ${props => props.theme.spacing.xl};
    }
`;

const Header = styled.header<{ theme: any }>`
    background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
    color: white;
    padding: ${props => props.theme.spacing.lg};
    border-radius: ${props => props.theme.borderRadius.md};
    margin-bottom: ${props => props.theme.spacing.lg};
    text-align: center;
    box-shadow: ${props => props.theme.shadows.md};
    position: relative;
    overflow: hidden;

    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl};
        border-radius: ${props => props.theme.borderRadius.lg};
        margin-bottom: ${props => props.theme.spacing.xl};
        box-shadow: ${props => props.theme.shadows.lg};
    }

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
        50% { transform: scale(1.05) rotate(180deg); opacity: 0.8; }
    }
`;

const HeaderContent = styled.div`
    position: relative;
    z-index: 1;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    @media (min-width: 480px) {
        font-size: 28px;
        margin: 0 0 12px 0;
        gap: 16px;
    }

    @media (min-width: 768px) {
        font-size: 36px;
        font-weight: 800;
        margin: 0 0 16px 0;
        gap: 20px;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 1024px) {
        font-size: 42px;
    }
`;

const Subtitle = styled.p`
    font-size: 14px;
    opacity: 0.95;
    margin: 0;
    font-weight: 500;

    @media (min-width: 480px) {
        font-size: 16px;
    }

    @media (min-width: 768px) {
        font-size: 18px;
    }

    @media (min-width: 1024px) {
        font-size: 20px;
    }
`;

const Controls = styled.div<{ theme: any }>`
    display: flex;
    justify-content: center;
    gap: ${props => props.theme.spacing.sm};
    margin-bottom: ${props => props.theme.spacing.lg};
    flex-wrap: wrap;
    padding: 0 ${props => props.theme.spacing.sm};

    @media (min-width: 480px) {
        gap: ${props => props.theme.spacing.md};
        margin-bottom: ${props => props.theme.spacing.xl};
        padding: 0;
    }

    @media (min-width: 768px) {
        gap: ${props => props.theme.spacing.md};
    }
`;

const PeriodButton = styled.button<{ active: boolean; theme: any }>`
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
    color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
    border-radius: ${props => props.theme.borderRadius.md};
    font-weight: 600;
    cursor: pointer;
    transition: all ${props => props.theme.transitions.fast};
    font-size: 12px;
    box-shadow: ${props => props.active ? props.theme.shadows.sm : 'none'};
    min-width: 60px;
    
    /* Touch-friendly sizing */
    min-height: 36px;

    @media (min-width: 480px) {
        padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
        font-size: 14px;
        min-width: 80px;
        min-height: 40px;
    }

    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
        border-radius: ${props => props.theme.borderRadius.lg};
        font-weight: 700;
        font-size: 16px;
        box-shadow: ${props => props.active ? props.theme.shadows.md : props.theme.shadows.sm};
        min-width: 100px;
        min-height: 44px;
    }

    &:hover {
        border-color: ${props => props.theme.colors.primary};
        background-color: ${props => props.active ? props.theme.colors.primary : `${props.theme.colors.primary}20`};
        transform: translateY(-1px);
        box-shadow: ${props => props.theme.shadows.md};
    }

    &:active {
        transform: translateY(0);
    }
    
    /* Remove hover effects on touch devices */
    @media (hover: none) {
        &:hover {
            transform: none;
        }
    }
`;

const GridContainer = styled.div<{ theme: any }>`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
    margin-bottom: ${props => props.theme.spacing.lg};

    @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: ${props => props.theme.spacing.xl};
        margin-bottom: ${props => props.theme.spacing.xl};
    }
    
    @media (min-width: 1200px) {
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    }
`;

const FullWidthSection = styled.div<{ theme: any }>`
    width: 100%;
    margin-bottom: ${props => props.theme.spacing.lg};

    @media (min-width: 768px) {
        margin-bottom: ${props => props.theme.spacing.xl};
    }
`;

const LoadingContainer = styled.div<{ theme: any }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
    
    @media (min-width: 768px) {
        height: 60vh;
        gap: ${props => props.theme.spacing.lg};
    }
`;

const LoadingSpinner = styled.div<{ theme: any }>`
    width: 40px;
    height: 40px;
    border: 4px solid ${props => props.theme.colors.border};
    border-top: 4px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @media (min-width: 768px) {
        width: 60px;
        height: 60px;
        border-width: 6px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const LoadingText = styled.div<{ theme: any }>`
    font-size: 16px;
    color: ${props => props.theme.colors.text.secondary};
    font-weight: 600;
    text-align: center;

    @media (min-width: 768px) {
        font-size: 20px;
    }
`;

const ErrorMessage = styled.div<{ theme: any }>`
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
    color: white;
    padding: ${props => props.theme.spacing.lg};
    border-radius: ${props => props.theme.borderRadius.md};
    text-align: center;
    font-size: 16px;
    margin: ${props => props.theme.spacing.lg} 0;
    box-shadow: ${props => props.theme.shadows.md};

    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl};
        border-radius: ${props => props.theme.borderRadius.lg};
        font-size: 18px;
        margin: ${props => props.theme.spacing.xl} 0;
        box-shadow: ${props => props.theme.shadows.lg};
    }
`;

const RetryButton = styled.button<{ theme: any }>`
    background: white;
    color: #ff6b6b;
    border: none;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.sm};
    font-weight: 600;
    cursor: pointer;
    margin-top: ${props => props.theme.spacing.sm};
    transition: all ${props => props.theme.transitions.fast};
    font-size: 14px;

    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
        border-radius: ${props => props.theme.borderRadius.md};
        margin-top: ${props => props.theme.spacing.md};
        font-size: 16px;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
`;

interface AnalyticsDashboardProps {
    onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
    const { theme } = useTheme();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<number>(30);

    const periodOptions = [
        { value: 7, label: '7 Days', icon: '📅' },
        { value: 30, label: '30 Days', icon: '📊' },
        { value: 90, label: '90 Days', icon: '📈' },
        { value: 365, label: '1 Year', icon: '🗓️' },
    ];

    const fetchAnalytics = async (days: number) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(`Fetching analytics for ${days} days`);
            const data = await analyticsApi.getAnalytics(days);
            console.log('Analytics data received:', data);
            setAnalyticsData(data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError('Failed to load analytics data. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(selectedPeriod);
    }, [selectedPeriod]);

    const handlePeriodChange = (days: number) => {
        setSelectedPeriod(days);
    };

    if (error) {
        return (
            <DashboardContainer theme={theme}>
                <Header theme={theme}>
                    <HeaderContent>
                        <Title>📊 Analytics Dashboard</Title>
                        <Subtitle>Unable to load your productivity insights</Subtitle>
                    </HeaderContent>
                </Header>
                <ErrorMessage theme={theme}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>😞</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Oops!</div>
                    {error}
                    <RetryButton theme={theme} onClick={() => fetchAnalytics(selectedPeriod)}>
                        🔄 Try Again
                    </RetryButton>
                </ErrorMessage>
            </DashboardContainer>
        );
    }

    return (
        <DashboardContainer theme={theme}>
            <Header theme={theme}>
                <HeaderContent>
                    <Title>📊 Analytics Dashboard</Title>
                    <Subtitle>Deep insights into your productivity and task completion patterns</Subtitle>
                </HeaderContent>
            </Header>

            <Controls theme={theme}>
                {periodOptions.map(option => (
                    <PeriodButton
                        key={option.value}
                        active={selectedPeriod === option.value}
                        onClick={() => handlePeriodChange(option.value)}
                        theme={theme}
                    >
                        <span style={{ marginRight: '4px' }}>{option.icon}</span>
                        {option.label}
                    </PeriodButton>
                ))}
            </Controls>

            {isLoading ? (
                <LoadingContainer theme={theme}>
                    <LoadingSpinner theme={theme} />
                    <LoadingText theme={theme}>
                        Analyzing your productivity data...
                    </LoadingText>
                </LoadingContainer>
            ) : analyticsData ? (
                <>
                    <FullWidthSection theme={theme}>
                        <StatsCards data={analyticsData} />
                    </FullWidthSection>

                    <FullWidthSection theme={theme}>
                        <StreakDisplay streakData={analyticsData.streakData} />
                    </FullWidthSection>

                    <GridContainer theme={theme}>
                        <CompletionChart data={analyticsData.dailyStats} />
                        <PriorityChart data={analyticsData.priorityStats} />
                    </GridContainer>

                    <FullWidthSection theme={theme}>
                        <ProductivityHeatmap data={analyticsData.heatmapData} />
                    </FullWidthSection>

                    <GridContainer theme={theme}>
                        <TrendsChart data={analyticsData.weeklyStats} />
                        <TopCategories data={analyticsData.topCategories} />
                    </GridContainer>
                </>
            ) : null}
        </DashboardContainer>
    );
}; 