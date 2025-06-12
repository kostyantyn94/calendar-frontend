import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const PlaceholderContainer = styled.div<{ height?: number }>`
    background-color: ${theme.colors.primary}20;
    border: 2px dashed ${theme.colors.primary};
    border-radius: ${theme.borderRadius.sm};
    height: ${props => props.height || 32}px;
    margin-bottom: ${theme.spacing.xs};
    transition: all ${theme.transitions.fast};
    animation: pulse 1s ease-in-out infinite;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    @keyframes pulse {
        0% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 0.4;
        }
    }
`;

interface DragPlaceholderProps {
    height?: number;
}

export const DragPlaceholder: React.FC<DragPlaceholderProps> = ({ height }) => {
    return <PlaceholderContainer height={height} />;
};