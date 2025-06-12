import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../contexts/ThemeContext';

const CategoriesContainer = styled.div<{ theme: any }>`
    background: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.lg};
    padding: ${props => props.theme.spacing.md};
    box-shadow: ${props => props.theme.shadows.md};
    width: 100%;
    overflow: hidden; /* Prevent container from expanding */
    
    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl};
    }
`;

const CategoriesTitle = styled.h3<{ theme: any }>`
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

const CategoryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    @media (min-width: 768px) {
        gap: 16px;
    }
`;

const CategoryItem = styled.div<{ theme: any }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${props => props.theme.spacing.sm};
    background: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    transition: all ${props => props.theme.transitions.fast};
    min-width: 0; /* Allow flex items to shrink */
    width: 100%; /* Ensure full width usage */
    overflow: hidden; /* Prevent overflow */

    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.md};
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: ${props => props.theme.shadows.md};
            border-color: ${props => props.theme.colors.primary};
        }
    }
    
    /* Remove hover effects on touch devices */
    @media (hover: none) {
        &:hover {
            transform: none;
            box-shadow: none;
            border-color: ${props => props.theme.colors.border};
        }
    }
`;

const CategoryInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0; /* Critical: Allow flex item to shrink */
    overflow: hidden;
    
    @media (min-width: 768px) {
        gap: 12px;
    }
`;

const CategoryName = styled.span<{ theme: any }>`
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
    text-transform: capitalize;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0; /* Critical: Allow text to shrink */
    max-width: 150px; /* Force maximum width on mobile */
    font-size: 14px;
    
    @media (min-width: 480px) {
        max-width: 200px;
    }
    
    @media (min-width: 768px) {
        max-width: 250px;
        font-size: 16px;
    }
    
    @media (min-width: 1024px) {
        max-width: none; /* Remove limit on larger screens */
    }
`;

const CategoryCount = styled.span<{ theme: any }>`
    background: ${props => props.theme.colors.primary};
    color: white;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    flex-shrink: 0; /* Prevent count from shrinking */
    min-width: 24px;
    text-align: center;
    
    @media (min-width: 768px) {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        min-width: 28px;
    }
`;

const ProgressBarContainer = styled.div<{ theme: any }>`
    width: 60px;
    height: 6px;
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
    overflow: hidden;
    flex-shrink: 0; /* Prevent progress bar from shrinking */
    
    @media (min-width: 768px) {
        width: 100px;
        height: 8px;
        border-radius: 4px;
    }
`;

const ProgressBarFill = styled.div<{ percentage: number; theme: any }>`
    height: 100%;
    background: ${props => props.theme.colors.primary};
    width: ${props => props.percentage}%;
    transition: width 0.6s ease;
    border-radius: inherit;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0; /* Prevent right section from shrinking */
    
    @media (min-width: 768px) {
        gap: 12px;
    }
`;

const NumberBadge = styled.div<{ index: number }>`
    min-width: 20px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => `hsl(${(props.index * 45) % 360}, 70%, 60%)`};
    display: flex;
    align-items: center;
    justify-content: center;
    fontSize: 10px;
    fontWeight: bold;
    color: white;
    flex-shrink: 0;
    
    @media (min-width: 768px) {
        min-width: 24px;
        width: 24px;
        height: 24px;
        font-size: 12px;
    }
`;

const EmptyState = styled.div<{ theme: any }>`
    text-align: center;
    padding: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text.secondary};
    font-style: italic;
    font-size: 14px;
    
    @media (min-width: 768px) {
        padding: ${props => props.theme.spacing.xl};
        font-size: 16px;
    }
`;

interface TopCategoriesProps {
    data: { category: string; count: number }[];
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ data }) => {
    const { theme } = useTheme();

    if (!data || data.length === 0) {
        return (
            <CategoriesContainer theme={theme}>
                <CategoriesTitle theme={theme}>
                    🏷️ Top Categories
                </CategoriesTitle>
                <EmptyState theme={theme}>
                    No categories available yet. Create some tasks to see patterns!
                </EmptyState>
            </CategoriesContainer>
        );
    }

    const maxCount = Math.max(...data.map(item => item.count));

    return (
        <CategoriesContainer theme={theme}>
            <CategoriesTitle theme={theme}>
                🏷️ Top Categories
            </CategoriesTitle>
            
            <CategoryList>
                {data.slice(0, 8).map((category, index) => {
                    const percentage = (category.count / maxCount) * 100;
                    
                    return (
                        <CategoryItem key={category.category} theme={theme}>
                            <CategoryInfo>
                                <NumberBadge index={index}>
                                    {index + 1}
                                </NumberBadge>
                                <CategoryName theme={theme} title={category.category}>
                                    {category.category}
                                </CategoryName>
                            </CategoryInfo>
                            
                            <RightSection>
                                <ProgressBarContainer theme={theme}>
                                    <ProgressBarFill 
                                        percentage={percentage} 
                                        theme={theme}
                                    />
                                </ProgressBarContainer>
                                <CategoryCount theme={theme}>
                                    {category.count}
                                </CategoryCount>
                            </RightSection>
                        </CategoryItem>
                    );
                })}
            </CategoryList>
        </CategoriesContainer>
    );
}; 