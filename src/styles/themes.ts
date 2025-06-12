export interface Theme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        success: string;
        danger: string;
        warning: string;

        background: string;
        surface: string;
        border: string;
        shadow: string;

        text: {
            primary: string;
            secondary: string;
            light: string;
            contrast: string;
        };

        calendar: {
            today: string;
            weekend: string;
            otherMonth: string;
            hover: string;
            selected: string;
        };

        priority: {
            low: string;
            medium: string;
            high: string;
            urgent: string;
        };

        task: {
            colors: string[];
        };
    };

    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };

    borderRadius: {
        sm: string;
        md: string;
        lg: string;
    };

    shadows: {
        sm: string;
        md: string;
        lg: string;
    };

    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
}

// Базовые значения (не зависят от темы)
const baseTheme = {
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },

    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
    },

    transitions: {
        fast: '0.15s ease',
        normal: '0.3s ease',
        slow: '0.5s ease',
    },
};

// Светлая тема (существующая)
export const lightTheme: Theme = {
    name: 'light',
    colors: {
        primary: '#4a90e2',
        secondary: '#f39c12',
        success: '#27ae60',
        danger: '#e74c3c',
        warning: '#f1c40f',

        background: '#ffffff',
        surface: '#f8f9fa',
        border: '#e1e4e8',
        shadow: 'rgba(0, 0, 0, 0.1)',

        text: {
            primary: '#333333',
            secondary: '#666666',
            light: '#999999',
            contrast: '#ffffff',
        },

        calendar: {
            today: '#e3f2fd',
            weekend: '#f5f5f5',
            otherMonth: '#fafafa',
            hover: '#f0f0f0',
            selected: '#bbdefb',
        },

        priority: {
            low: '#95a5a6',
            medium: '#3498db',
            high: '#f39c12',
            urgent: '#e74c3c',
        },

        task: {
            colors: [
                '#3498db', // Blue
                '#2ecc71', // Green
                '#f39c12', // Orange
                '#e74c3c', // Red
                '#9b59b6', // Purple
                '#1abc9c', // Turquoise
                '#34495e', // Dark gray
            ],
        },
    },
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 20px rgba(0, 0, 0, 0.15)',
    },
    ...baseTheme,
};

// Темная тема
export const darkTheme: Theme = {
    name: 'dark',
    colors: {
        primary: '#6bb6ff',
        secondary: '#ffd93d',
        success: '#4caf50',
        danger: '#f44336',
        warning: '#ff9800',

        background: '#121212',
        surface: '#1e1e1e',
        border: '#333333',
        shadow: 'rgba(0, 0, 0, 0.3)',

        text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
            light: '#808080',
            contrast: '#000000',
        },

        calendar: {
            today: '#1565c0',
            weekend: '#2a2a2a',
            otherMonth: '#171717',
            hover: '#333333',
            selected: '#1976d2',
        },

        priority: {
            low: '#78909c',
            medium: '#42a5f5',
            high: '#ffa726',
            urgent: '#ef5350',
        },

        task: {
            colors: [
                '#42a5f5', // Light Blue
                '#66bb6a', // Light Green
                '#ffa726', // Orange
                '#ef5350', // Red
                '#ab47bc', // Purple
                '#26a69a', // Teal
                '#546e7a', // Blue Gray
            ],
        },
    },
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px rgba(0, 0, 0, 0.2)',
        lg: '0 10px 20px rgba(0, 0, 0, 0.25)',
    },
    ...baseTheme,
};

// Синяя тема
export const blueTheme: Theme = {
    name: 'blue',
    colors: {
        primary: '#1e88e5',
        secondary: '#42a5f5',
        success: '#43a047',
        danger: '#e53935',
        warning: '#fb8c00',

        background: '#f3f8ff',
        surface: '#e8f4fd',
        border: '#bbdefb',
        shadow: 'rgba(30, 136, 229, 0.15)',

        text: {
            primary: '#0d47a1',
            secondary: '#1565c0',
            light: '#64b5f6',
            contrast: '#ffffff',
        },

        calendar: {
            today: '#c3d9ff',
            weekend: '#e3f2fd',
            otherMonth: '#f8fbff',
            hover: '#e1f5fe',
            selected: '#90caf9',
        },

        priority: {
            low: '#78909c',
            medium: '#1976d2',
            high: '#f57c00',
            urgent: '#d32f2f',
        },

        task: {
            colors: [
                '#1976d2', // Blue
                '#388e3c', // Green
                '#f57c00', // Orange
                '#d32f2f', // Red
                '#7b1fa2', // Purple
                '#00796b', // Teal
                '#455a64', // Blue Gray
            ],
        },
    },
    shadows: {
        sm: '0 1px 3px rgba(30, 136, 229, 0.15)',
        md: '0 4px 6px rgba(30, 136, 229, 0.12)',
        lg: '0 10px 20px rgba(30, 136, 229, 0.18)',
    },
    ...baseTheme,
};

// Зеленая тема
export const greenTheme: Theme = {
    name: 'green',
    colors: {
        primary: '#4caf50',
        secondary: '#8bc34a',
        success: '#66bb6a',
        danger: '#f44336',
        warning: '#ff9800',

        background: '#f1f8e9',
        surface: '#e8f5e8',
        border: '#c8e6c9',
        shadow: 'rgba(76, 175, 80, 0.15)',

        text: {
            primary: '#1b5e20',
            secondary: '#2e7d32',
            light: '#66bb6a',
            contrast: '#ffffff',
        },

        calendar: {
            today: '#c8e6c9',
            weekend: '#e8f5e8',
            otherMonth: '#f9fbe7',
            hover: '#f1f8e9',
            selected: '#a5d6a7',
        },

        priority: {
            low: '#78909c',
            medium: '#388e3c',
            high: '#f57c00',
            urgent: '#d32f2f',
        },

        task: {
            colors: [
                '#388e3c', // Green
                '#1976d2', // Blue
                '#f57c00', // Orange
                '#d32f2f', // Red
                '#7b1fa2', // Purple
                '#00796b', // Teal
                '#455a64', // Blue Gray
            ],
        },
    },
    shadows: {
        sm: '0 1px 3px rgba(76, 175, 80, 0.15)',
        md: '0 4px 6px rgba(76, 175, 80, 0.12)',
        lg: '0 10px 20px rgba(76, 175, 80, 0.18)',
    },
    ...baseTheme,
};

// Фиолетовая тема
export const purpleTheme: Theme = {
    name: 'purple',
    colors: {
        primary: '#9c27b0',
        secondary: '#ba68c8',
        success: '#4caf50',
        danger: '#f44336',
        warning: '#ff9800',

        background: '#faf4ff',
        surface: '#f3e5f5',
        border: '#e1bee7',
        shadow: 'rgba(156, 39, 176, 0.15)',

        text: {
            primary: '#4a148c',
            secondary: '#6a1b9a',
            light: '#ab47bc',
            contrast: '#ffffff',
        },

        calendar: {
            today: '#e1bee7',
            weekend: '#f3e5f5',
            otherMonth: '#fce4ec',
            hover: '#f8bbd9',
            selected: '#ce93d8',
        },

        priority: {
            low: '#78909c',
            medium: '#7b1fa2',
            high: '#f57c00',
            urgent: '#d32f2f',
        },

        task: {
            colors: [
                '#7b1fa2', // Purple
                '#388e3c', // Green
                '#1976d2', // Blue
                '#f57c00', // Orange
                '#d32f2f', // Red
                '#00796b', // Teal
                '#455a64', // Blue Gray
            ],
        },
    },
    shadows: {
        sm: '0 1px 3px rgba(156, 39, 176, 0.15)',
        md: '0 4px 6px rgba(156, 39, 176, 0.12)',
        lg: '0 10px 20px rgba(156, 39, 176, 0.18)',
    },
    ...baseTheme,
};

export const themes = {
    light: lightTheme,
    dark: darkTheme,
    blue: blueTheme,
    green: greenTheme,
    purple: purpleTheme,
};

export type ThemeKey = keyof typeof themes; 