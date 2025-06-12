import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AppSettings {
    compactMode: boolean;
    animationsEnabled: boolean;
    showWeekends: boolean;
    showHolidays: boolean;
    startWeekOnMonday: boolean;
    taskDensity: 'comfortable' | 'compact' | 'spacious';
    fontSize: 'small' | 'medium' | 'large';
    showTaskCount: boolean;
    highlightToday: boolean;
    autoSave: boolean;
}

interface SettingsContextType {
    settings: AppSettings;
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
    resetSettings: () => void;
}

const defaultSettings: AppSettings = {
    compactMode: false,
    animationsEnabled: true,
    showWeekends: true,
    showHolidays: true,
    startWeekOnMonday: true,
    taskDensity: 'comfortable',
    fontSize: 'medium',
    showTaskCount: true,
    highlightToday: true,
    autoSave: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const savedSettings = localStorage.getItem('calendar-settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                return { ...defaultSettings, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load settings from localStorage:', error);
        }
        return defaultSettings;
    });

    // Сохраняем настройки в localStorage при их изменении
    useEffect(() => {
        try {
            localStorage.setItem('calendar-settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Failed to save settings to localStorage:', error);
        }
    }, [settings]);

    // Применяем настройки к DOM
    useEffect(() => {
        const root = document.documentElement;
        
        // Размер шрифта
        const fontSizeMap = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        root.style.setProperty('--app-font-size', fontSizeMap[settings.fontSize]);
        
        // Анимации
        const transitionDuration = settings.animationsEnabled ? '0.3s' : '0s';
        root.style.setProperty('--transition-duration', transitionDuration);
        
        // Компактный режим
        const spacing = settings.compactMode ? '0.5' : '1';
        root.style.setProperty('--spacing-multiplier', spacing);
        
        // Плотность задач
        const taskSpacingMap = {
            compact: '2px',
            comfortable: '4px',
            spacious: '8px'
        };
        root.style.setProperty('--task-spacing', taskSpacingMap[settings.taskDensity]);
        
    }, [settings]);

    const updateSetting = <K extends keyof AppSettings>(
        key: K,
        value: AppSettings[K]
    ) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('calendar-settings');
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSetting,
                resetSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}; 