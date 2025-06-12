import React from 'react';
import styled from '@emotion/styled';
import { ProductivityHeatmapData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const HeatmapContainer = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.lg};
    padding: ${props => props.theme.spacing.md};
    box-shadow: ${props => props.theme.shadows.md};
    
    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl};
    }
`;

const HeatmapTitle = styled.h3<{ theme: any }>`
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

const HeatmapDescription = styled.div<{ theme: any }>`
    text-align: center;
    font-size: 12px;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 12px;
    
    @media (min-width: 768px) {
        font-size: 14px;
        margin-bottom: 16px;
    }
`;

const HeatmapWrapper = styled.div`
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
        height: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
    }
`;

const HeatmapContent = styled.div`
    min-width: 600px; /* Minimum width to prevent cramping */
    
    @media (min-width: 768px) {
        min-width: 0;
    }
`;

const MonthLabels = styled.div<{ theme: any }>`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 4px;
    margin-bottom: 6px;
    font-size: 10px;
    color: ${props => props.theme.colors.text.secondary};
    text-align: center;
    padding: 0 2px;
    
    @media (min-width: 768px) {
        gap: 8px;
        margin-bottom: 8px;
        font-size: 12px;
    }
`;

const HeatmapGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(53, 1fr);
    gap: 1px;
    justify-content: center;
    margin: 16px 0;
    
    @media (min-width: 768px) {
        gap: 2px;
        margin: 24px 0;
    }
`;

const HeatmapCell = styled.div<{ level: number; theme: any }>`
    width: 10px;
    height: 10px;
    border-radius: 1px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: ${props => {
        const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
        return colors[props.level] || colors[0];
    }};
    
    @media (min-width: 768px) {
        width: 12px;
        height: 12px;
        border-radius: 2px;
    }
    
    @media (min-width: 1024px) {
        width: 14px;
        height: 14px;
    }

    &:hover {
        transform: scale(1.2);
        border: 1px solid ${props => props.theme.colors.primary};
        z-index: 1;
        position: relative;
    }
    
    /* Touch devices - no hover effect, but tap feedback */
    @media (hover: none) {
        &:hover {
            transform: none;
            border: none;
        }
        
        &:active {
            transform: scale(0.9);
        }
    }
`;

const Legend = styled.div<{ theme: any }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 12px;
    font-size: 10px;
    color: ${props => props.theme.colors.text.secondary};
    
    @media (min-width: 768px) {
        gap: 8px;
        margin-top: 16px;
        font-size: 12px;
    }
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
    
    @media (min-width: 768px) {
        gap: 4px;
    }
`;

const LegendCell = styled(HeatmapCell)`
    cursor: default;
    margin: 0 1px;
    
    &:hover {
        transform: none;
        border: none;
    }
`;

const Tooltip = styled.div<{ theme: any }>`
    position: fixed;
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.sm};
    padding: 6px 10px;
    font-size: 11px;
    color: ${props => props.theme.colors.text.primary};
    box-shadow: ${props => props.theme.shadows.lg};
    z-index: 1000;
    pointer-events: none;
    white-space: nowrap;
    max-width: 250px;
    
    @media (min-width: 768px) {
        padding: 8px 12px;
        font-size: 12px;
    }
`;

const MobileHint = styled.div<{ theme: any }>`
    display: block;
    text-align: center;
    font-size: 11px;
    color: ${props => props.theme.colors.text.secondary};
    margin-top: 8px;
    font-style: italic;
    
    @media (min-width: 768px) {
        display: none;
    }
`;

interface ProductivityHeatmapProps {
    data: ProductivityHeatmapData[];
}

export const ProductivityHeatmap: React.FC<ProductivityHeatmapProps> = ({ data }) => {
    const { theme } = useTheme();
    const [tooltip, setTooltip] = React.useState<{ visible: boolean; content: string; x: number; y: number }>({
        visible: false,
        content: '',
        x: 0,  
        y: 0
    });

    const handleCellHover = (event: React.MouseEvent, dayData: ProductivityHeatmapData) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const date = new Date(dayData.date).toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        setTooltip({
            visible: true,
            content: `${date}: ${dayData.count} tasks completed`,
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    const handleCellLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    // Create a map for quick lookup
    const dataMap = new Map(data.map(item => [item.date, item]));

    // Generate grid data for the last year (365 days, organized by weeks)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // 365 days ago

    const gridData: (ProductivityHeatmapData | null)[] = [];
    const currentDate = new Date(startDate);

    // Start from the beginning of the week
    while (currentDate.getDay() !== 0) {
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // Generate 53 weeks * 7 days
    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayData = dataMap.get(dateStr);
            
            if (currentDate <= today && currentDate >= startDate) {
                gridData.push(dayData || { date: dateStr, count: 0, level: 0 });
            } else {
                gridData.push(null);
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return (
        <HeatmapContainer theme={theme}>
            <HeatmapTitle theme={theme}>
                🌟 Productivity Heatmap
            </HeatmapTitle>
            
            <HeatmapDescription theme={theme}>
                GitHub-style view of your daily task completion activity
            </HeatmapDescription>

            <HeatmapWrapper>
                <HeatmapContent>
                    <MonthLabels theme={theme}>
                        {months.map(month => (
                            <div key={month}>{month}</div>
                        ))}
                    </MonthLabels>

                    <HeatmapGrid>
                        {gridData.map((dayData, index) => (
                            <HeatmapCell
                                key={index}
                                level={dayData?.level || 0}
                                theme={theme}
                                onMouseEnter={dayData ? (e) => handleCellHover(e, dayData) : undefined}
                                onMouseLeave={handleCellLeave}
                            />
                        ))}
                    </HeatmapGrid>

                    <Legend theme={theme}>
                        <span>Less</span>
                        {[0, 1, 2, 3, 4].map(level => (
                            <LegendItem key={level}>
                                <LegendCell level={level} theme={theme} />
                            </LegendItem>
                        ))}
                        <span>More</span>
                    </Legend>
                </HeatmapContent>
            </HeatmapWrapper>

            <MobileHint theme={theme}>
                Scroll horizontally to see full year • Tap cells for details
            </MobileHint>

            {tooltip.visible && (
                <Tooltip
                    theme={theme}
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    {tooltip.content}
                </Tooltip>
            )}
        </HeatmapContainer>
    );
}; 