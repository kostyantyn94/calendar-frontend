import React from 'react';
import styled from '@emotion/styled';
import { StreakData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const StreakContainer = styled.div<{ theme: any }>`
    background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
    border-radius: ${props => props.theme.borderRadius.lg};
    padding: ${props => props.theme.spacing.xl};
    color: white;
    text-align: center;
    box-shadow: ${props => props.theme.shadows.lg};
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.05); opacity: 0.8; }
    }
`;

const StreakContent = styled.div`
    position: relative;
    z-index: 1;
`;

const StreakTitle = styled.h3`
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
`;

const StreakNumber = styled.div`
    font-size: 72px;
    font-weight: 800;
    margin: 16px 0;
    line-height: 1;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const StreakStats = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 24px;
    margin-top: 24px;
`;

const StatItem = styled.div`
    text-align: center;
`;

const StatValue = styled.div`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
`;

const StatLabel = styled.div`
    font-size: 14px;
    opacity: 0.9;
    font-weight: 500;
`;

const MotivationalText = styled.p`
    font-size: 16px;
    margin: 16px 0 0 0;
    opacity: 0.95;
    font-style: italic;
`;

interface StreakDisplayProps {
    streakData: StreakData;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streakData }) => {
    const { theme } = useTheme();

    const getMotivationalMessage = (streak: number) => {
        if (streak === 0) return "Start your streak today! 💪";
        if (streak === 1) return "Great start! Keep it going! 🌟";
        if (streak < 7) return "Building momentum! 🚀";
        if (streak < 30) return "Amazing consistency! 🔥";
        return "You're a productivity legend! 👑";
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <StreakContainer theme={theme}>
            <StreakContent>
                <StreakTitle>
                    🔥 Current Streak
                </StreakTitle>
                
                <StreakNumber>
                    {streakData.currentStreak}
                </StreakNumber>
                
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                    {streakData.currentStreak === 1 ? 'Day' : 'Days'}
                </div>
                
                <MotivationalText>
                    {getMotivationalMessage(streakData.currentStreak)}
                </MotivationalText>

                <StreakStats>
                    <StatItem>
                        <StatValue>{streakData.longestStreak}</StatValue>
                        <StatLabel>Personal Best</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatValue>{formatDate(streakData.lastCompletionDate)}</StatValue>
                        <StatLabel>Last Completion</StatLabel>
                    </StatItem>
                </StreakStats>
            </StreakContent>
        </StreakContainer>
    );
}; 