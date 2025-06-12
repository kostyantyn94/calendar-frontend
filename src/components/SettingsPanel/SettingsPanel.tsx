import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { Modal } from '../common/Modal';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsContainer = styled.div<{ theme: any }>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.lg};
`;

const SettingsSection = styled.div<{ theme: any }>`
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3<{ theme: any }>`
    margin: 0 0 ${props => props.theme.spacing.md} 0;
    color: ${props => props.theme.colors.text.primary};
    font-size: 16px;
    font-weight: 600;
`;

const ThemeGrid = styled.div<{ theme: any }>`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${props => props.theme.spacing.md};
`;

const ThemeCard = styled.button<{ isSelected: boolean; theme: any }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md};
    border: 2px solid ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    background-color: ${props => props.theme.colors.surface};
    cursor: pointer;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
        border-color: ${props => props.theme.colors.primary};
        background-color: ${props => props.theme.colors.calendar.hover};
    }
`;

const ThemePreview = styled.div<{ themeKey: string; theme: any }>`
    width: 80px;
    height: 60px;
    border-radius: ${props => props.theme.borderRadius.sm};
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    ${props => {
        const previewColors = {
            auto: {
                bg: 'linear-gradient(135deg, #f8f9fa 50%, #1e1e1e 50%)',
                header: 'linear-gradient(135deg, #4a90e2 50%, #6bb6ff 50%)',
                content: 'linear-gradient(135deg, #e1e4e8 50%, #333333 50%)'
            },
            light: {
                bg: '#f8f9fa',
                header: '#4a90e2',
                content: '#e1e4e8'
            },
            dark: {
                bg: '#1e1e1e',
                header: '#6bb6ff',
                content: '#333333'
            },
            blue: {
                bg: '#e8f4fd',
                header: '#1e88e5',
                content: '#bbdefb'
            },
            green: {
                bg: '#e8f5e8',
                header: '#4caf50',
                content: '#c8e6c9'
            },
            purple: {
                bg: '#f3e5f5',
                header: '#9c27b0',
                content: '#e1bee7'
            }
        };
        
        const colors = previewColors[props.themeKey as keyof typeof previewColors] || previewColors.light;
        
        return `
            background: ${colors.bg};
            
            &::before {
                content: '';
                height: 20px;
                background: ${colors.header};
            }
            
            &::after {
                content: '';
                flex: 1;
                background: ${colors.content};
                margin: 4px;
                border-radius: 2px;
            }
        `;
    }}
`;

const ThemeName = styled.span<{ theme: any }>`
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
    text-align: center;
`;

const CustomizationOptions = styled.div<{ theme: any }>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
`;

const OptionRow = styled.div<{ theme: any }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme.spacing.sm} 0;
`;

const OptionLabel = styled.label<{ theme: any }>`
    font-size: 14px;
    color: ${props => props.theme.colors.text.primary};
    cursor: pointer;
`;

const Toggle = styled.input<{ theme: any }>`
    width: 48px;
    height: 24px;
    appearance: none;
    background-color: ${props => props.theme.colors.border};
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background-color ${props => props.theme.transitions.fast};
    
    &:checked {
        background-color: ${props => props.theme.colors.primary};
    }
    
    &::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: ${props => props.theme.colors.background};
        top: 2px;
        left: 2px;
        transition: transform ${props => props.theme.transitions.fast};
        border: 1px solid ${props => props.theme.colors.border};
    }
    
    &:checked::after {
        transform: translateX(24px);
        border-color: ${props => props.theme.colors.primary};
    }
`;

const ResetButton = styled.button<{ theme: any }>`
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    background-color: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.sm};
    color: ${props => props.theme.colors.text.primary};
    cursor: pointer;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
        background-color: ${props => props.theme.colors.calendar.hover};
        border-color: ${props => props.theme.colors.primary};
    }
`;

const Select = styled.select<{ theme: any }>`
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.sm};
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text.primary};
    font-size: 14px;
    cursor: pointer;
    min-width: 120px;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
    }
    
    option {
        background-color: ${props => props.theme.colors.surface};
        color: ${props => props.theme.colors.text.primary};
    }
`;

const SettingsGroup = styled.div<{ theme: any }>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
`;

const Description = styled.p<{ theme: any }>`
    font-size: 12px;
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
    line-height: 1.4;
`;

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const { theme, themeKey, setTheme, availableThemes } = useTheme();
    const { settings, updateSetting, resetSettings } = useSettings();

    const handleThemeChange = (newThemeKey: string) => {
        setTheme(newThemeKey as any);
    };

    const handleReset = () => {
        setTheme('auto');
        resetSettings();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Appearance Settings"
            width="600px"
        >
            <SettingsContainer theme={theme}>
                <SettingsSection theme={theme}>
                    <SectionTitle theme={theme}>Theme</SectionTitle>
                    <ThemeGrid theme={theme}>
                        {availableThemes.map((themeOption) => (
                            <ThemeCard
                                key={themeOption.key}
                                isSelected={themeOption.key === themeKey}
                                onClick={() => handleThemeChange(themeOption.key)}
                                theme={theme}
                            >
                                <ThemePreview themeKey={themeOption.key} theme={theme} />
                                <ThemeName theme={theme}>{themeOption.displayName}</ThemeName>
                            </ThemeCard>
                        ))}
                    </ThemeGrid>
                </SettingsSection>

                <SettingsSection theme={theme}>
                    <SectionTitle theme={theme}>Display</SectionTitle>
                    <SettingsGroup theme={theme}>
                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="compact-mode" theme={theme}>
                                Compact Mode
                            </OptionLabel>
                            <Toggle
                                id="compact-mode"
                                type="checkbox"
                                checked={settings.compactMode}
                                onChange={(e) => updateSetting('compactMode', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            Reduces spacing and element sizes to save space
                        </Description>

                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="animations" theme={theme}>
                                Animations
                            </OptionLabel>
                            <Toggle
                                id="animations"
                                type="checkbox"
                                checked={settings.animationsEnabled}
                                onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            Enables smooth transitions and interface animations
                        </Description>

                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="font-size" theme={theme}>
                                Font Size
                            </OptionLabel>
                            <Select
                                id="font-size"
                                value={settings.fontSize}
                                onChange={(e) => updateSetting('fontSize', e.target.value as any)}
                                theme={theme}
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </Select>
                        </OptionRow>
                        <Description theme={theme}>
                            Changes text size throughout the application
                        </Description>

                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="task-density" theme={theme}>
                                Task Density
                            </OptionLabel>
                            <Select
                                id="task-density"
                                value={settings.taskDensity}
                                onChange={(e) => updateSetting('taskDensity', e.target.value as any)}
                                theme={theme}
                            >
                                <option value="compact">Compact</option>
                                <option value="comfortable">Comfortable</option>
                                <option value="spacious">Spacious</option>
                            </Select>
                        </OptionRow>
                        <Description theme={theme}>
                            Controls the spacing between tasks in the calendar
                        </Description>
                    </SettingsGroup>
                </SettingsSection>

                <SettingsSection theme={theme}>
                    <SectionTitle theme={theme}>Calendar</SectionTitle>
                    <SettingsGroup theme={theme}>
                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="show-weekends" theme={theme}>
                                Show Weekends
                            </OptionLabel>
                            <Toggle
                                id="show-weekends"
                                type="checkbox"
                                checked={settings.showWeekends}
                                onChange={(e) => updateSetting('showWeekends', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            Display Saturday and Sunday in the calendar
                        </Description>

                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="show-holidays" theme={theme}>
                                Show Holidays
                            </OptionLabel>
                            <Toggle
                                id="show-holidays"
                                type="checkbox"
                                checked={settings.showHolidays}
                                onChange={(e) => updateSetting('showHolidays', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            Display public holidays
                        </Description>

                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="start-monday" theme={theme}>
                                Week starts on Monday
                            </OptionLabel>
                            <Toggle
                                id="start-monday"
                                type="checkbox"
                                checked={settings.startWeekOnMonday}
                                onChange={(e) => updateSetting('startWeekOnMonday', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            First day of week in calendar - Monday or Sunday
                        </Description>

                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="show-task-count" theme={theme}>
                                Show Task Count
                            </OptionLabel>
                            <Toggle
                                id="show-task-count"
                                type="checkbox"
                                checked={settings.showTaskCount}
                                onChange={(e) => updateSetting('showTaskCount', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            Display task count in the corner of each day
                        </Description>

                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="highlight-today" theme={theme}>
                                Highlight Today
                            </OptionLabel>
                            <Toggle
                                id="highlight-today"
                                type="checkbox"
                                checked={settings.highlightToday}
                                onChange={(e) => updateSetting('highlightToday', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            Special highlighting of the current date
                        </Description>
                    </SettingsGroup>
                </SettingsSection>

                <SettingsSection theme={theme}>
                    <SectionTitle theme={theme}>General</SectionTitle>
                    <SettingsGroup theme={theme}>
                        <OptionRow theme={theme}>
                            <OptionLabel htmlFor="auto-save" theme={theme}>
                                Auto Save
                            </OptionLabel>
                            <Toggle
                                id="auto-save"
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                                theme={theme}
                            />
                        </OptionRow>
                        <Description theme={theme}>
                            Automatically save changes without confirmation
                        </Description>
                    </SettingsGroup>
                </SettingsSection>

                <SettingsSection theme={theme}>
                    <SectionTitle theme={theme}>Reset Settings</SectionTitle>
                    <ResetButton onClick={handleReset} theme={theme}>
                        Reset All Settings
                    </ResetButton>
                </SettingsSection>
            </SettingsContainer>
        </Modal>
    );
}; 