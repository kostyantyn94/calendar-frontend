import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeKey } from '../../styles/themes';

type ThemeKeyWithAuto = ThemeKey | 'auto';

interface ThemeSelectorProps {
    className?: string;
}

const SelectorContainer = styled.div<{ theme: any }>`
    position: relative;
    display: inline-block;
`;

const ThemeButton = styled.button<{ theme: any }>`
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    background-color: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    color: ${props => props.theme.colors.text.primary};
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all ${props => props.theme.transitions.fast};
    min-width: 140px;
    justify-content: space-between;

    &:hover {
        background-color: ${props => props.theme.colors.calendar.hover};
        border-color: ${props => props.theme.colors.primary};
    }

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
        box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
    }
`;

const ThemeIcon = styled.div<{ themeKey: ThemeKeyWithAuto; theme: any }>`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${props => {
        const themeColors: Record<ThemeKeyWithAuto, string> = {
            auto: 'linear-gradient(45deg, #4a90e2 50%, #121212 50%)',
            light: '#4a90e2',
            dark: '#121212',
            blue: '#1e88e5',
            green: '#4caf50',
            purple: '#9c27b0',
        };
        const color = themeColors[props.themeKey];
        return color.includes('gradient') ? 'transparent' : color;
    }};
    background: ${props => {
        const themeColors: Record<ThemeKeyWithAuto, string> = {
            auto: 'linear-gradient(45deg, #4a90e2 50%, #121212 50%)',
            light: '#4a90e2',
            dark: '#121212',
            blue: '#1e88e5',
            green: '#4caf50',
            purple: '#9c27b0',
        };
        return themeColors[props.themeKey];
    }};
    border: 2px solid ${props => props.theme.colors.border};
    flex-shrink: 0;
`;

const Arrow = styled.span<{ isOpen: boolean; theme: any }>`
    transition: transform ${props => props.theme.transitions.fast};
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    font-size: 12px;
    color: ${props => props.theme.colors.text.secondary};
`;

const DropdownMenu = styled.div<{ isOpen: boolean; theme: any }>`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.colors.background};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: ${props => props.theme.shadows.md};
    z-index: 100;
    overflow: hidden;
    display: ${props => props.isOpen ? 'block' : 'none'};
    animation: ${props => props.isOpen ? 'slideDown 0.2s ease' : 'none'};

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const ThemeOption = styled.button<{ isSelected: boolean; theme: any }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    background-color: ${props => props.isSelected ? props.theme.colors.primary + '10' : 'transparent'};
    border: none;
    color: ${props => props.theme.colors.text.primary};
    cursor: pointer;
    font-size: 14px;
    text-align: left;
    transition: background-color ${props => props.theme.transitions.fast};

    &:hover {
        background-color: ${props => props.theme.colors.calendar.hover};
    }

    &:focus {
        outline: none;
        background-color: ${props => props.theme.colors.calendar.hover};
    }
`;

const ThemeName = styled.span`
    flex: 1;
`;

const CheckIcon = styled.span<{ theme: any }>`
    color: ${props => props.theme.colors.primary};
    font-size: 14px;
    font-weight: bold;
`;

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
    const { theme, themeKey, setTheme, availableThemes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const handleThemeSelect = (selectedThemeKey: ThemeKeyWithAuto) => {
        setTheme(selectedThemeKey);
        setIsOpen(false);
    };

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    // Закрываем dropdown при клике вне его
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('[data-theme-selector]')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const currentTheme = availableThemes.find(t => t.key === themeKey);

    return (
        <SelectorContainer className={className} data-theme-selector theme={theme}>
            <ThemeButton onClick={handleButtonClick} theme={theme}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                    <ThemeIcon themeKey={themeKey} theme={theme} />
                    <span>{currentTheme?.displayName}</span>
                </div>
                <Arrow isOpen={isOpen} theme={theme}>▼</Arrow>
            </ThemeButton>
            
            <DropdownMenu isOpen={isOpen} theme={theme}>
                {availableThemes.map((themeOption) => (
                    <ThemeOption
                        key={themeOption.key}
                        isSelected={themeOption.key === themeKey}
                        onClick={() => handleThemeSelect(themeOption.key)}
                        theme={theme}
                    >
                        <ThemeIcon themeKey={themeOption.key} theme={theme} />
                        <ThemeName>{themeOption.displayName}</ThemeName>
                        {themeOption.key === themeKey && <CheckIcon theme={theme}>✓</CheckIcon>}
                    </ThemeOption>
                ))}
            </DropdownMenu>
        </SelectorContainer>
    );
}; 