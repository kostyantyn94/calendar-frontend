import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, themes, ThemeKey, lightTheme } from '../styles/themes';
import { useSystemTheme } from '../hooks/useSystemTheme';

type ThemeKeyWithAuto = ThemeKey | 'auto';

interface ThemeContextType {
    theme: Theme;
    themeKey: ThemeKeyWithAuto;
    setTheme: (themeKey: ThemeKeyWithAuto) => void;
    availableThemes: { key: ThemeKeyWithAuto; name: string; displayName: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

const themeDisplayNames: Record<ThemeKeyWithAuto, string> = {
    auto: 'Auto',
    light: 'Light',
    dark: 'Dark',
    blue: 'Blue',
    green: 'Green',
    purple: 'Purple',
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemTheme = useSystemTheme();
    const [themeKey, setThemeKey] = useState<ThemeKeyWithAuto>(() => {
        const savedTheme = localStorage.getItem('calendar-theme') as ThemeKeyWithAuto;
        return savedTheme && (savedTheme === 'auto' || themes[savedTheme as ThemeKey]) ? savedTheme : 'auto';
    });

    // Определяем активную тему
    const activeTheme = themeKey === 'auto' ? systemTheme : (themeKey as ThemeKey);
    const theme = themes[activeTheme];

    const setTheme = (newThemeKey: ThemeKeyWithAuto) => {
        setThemeKey(newThemeKey);
        localStorage.setItem('calendar-theme', newThemeKey);
    };

    const availableThemes = [
        { key: 'auto' as const, name: 'auto', displayName: themeDisplayNames['auto'] },
        ...Object.keys(themes).map(key => ({
            key: key as ThemeKey,
            name: key,
            displayName: themeDisplayNames[key as ThemeKey],
        }))
    ];

    // Применяем цвета темы к HTML элементу для глобальных стилей
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--background-color', theme.colors.background);
        root.style.setProperty('--text-color', theme.colors.text.primary);
        root.style.setProperty('--surface-color', theme.colors.surface);
        root.style.setProperty('--border-color', theme.colors.border);
        root.style.setProperty('--primary-color', theme.colors.primary);
        
        // Устанавливаем цвет темы для метатега (для мобильных браузеров)
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme.colors.primary);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme.colors.primary;
            document.head.appendChild(meta);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeKey,
                setTheme,
                availableThemes,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 