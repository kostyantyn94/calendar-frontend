import { Global, css } from '@emotion/react';
import { useTheme } from '../contexts/ThemeContext';

export const GlobalStyles = () => {
    const { theme } = useTheme();
    
    return (
        <Global
            styles={css`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background-color: ${theme.colors.background};
            color: ${theme.colors.text.primary};
            line-height: 1.6;
            font-size: var(--app-font-size, 16px);
            transition: background-color var(--transition-duration, ${theme.transitions.normal}), 
                       color var(--transition-duration, ${theme.transitions.normal});
          }
          
          * {
            transition: all var(--transition-duration, ${theme.transitions.fast});
          }
          
          /* Применяем размер шрифта глобально */
          h1, h2, h3, h4, h5, h6 {
            font-size: calc(var(--app-font-size, 16px) * 1.5);
          }
          
          p, span, div, button, input, textarea, select {
            font-size: var(--app-font-size, 16px);
          }

      input, textarea, button {
        font-family: inherit;
      }

      button {
        cursor: pointer;
        border: none;
        background: none;
        padding: 0;
        font-size: inherit;
      }

          input[type="text"] {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.sm};
            font-size: 14px;
            background-color: ${theme.colors.background};
            color: ${theme.colors.text.primary};
            transition: border-color ${theme.transitions.fast};

            &:focus {
              outline: none;
              border-color: ${theme.colors.primary};
            }
          }

          textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid ${theme.colors.border};
            border-radius: ${theme.borderRadius.sm};
            font-size: 14px;
            background-color: ${theme.colors.background};
            color: ${theme.colors.text.primary};
            resize: vertical;
            transition: border-color ${theme.transitions.fast};

            &:focus {
              outline: none;
              border-color: ${theme.colors.primary};
            }
          }

          /* Scrollbar styles */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: ${theme.colors.surface};
          }

          ::-webkit-scrollbar-thumb {
            background: ${theme.colors.border};
            border-radius: ${theme.borderRadius.sm};
          }

          ::-webkit-scrollbar-thumb:hover {
            background: ${theme.colors.text.light};
          }
        `}
        />
    );
};