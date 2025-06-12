import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../contexts/ThemeContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${props => props.isOpen ? 'fadeIn 0.2s ease' : 'none'};
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div<{ width?: string; theme: any }>`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  width: ${props => props.width || '500px'};
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div<{ theme: any }>`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2<{ theme: any }>`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const CloseButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  font-size: 24px;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModalBody = styled.div<{ theme: any }>`
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  max-height: calc(90vh - 140px);
`;

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width }) => {
    const { theme } = useTheme();
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
            <ModalContent width={width} theme={theme}>
                <ModalHeader theme={theme}>
                    <ModalTitle theme={theme}>{title}</ModalTitle>
                    <CloseButton onClick={onClose} theme={theme}>×</CloseButton>
                </ModalHeader>
                <ModalBody theme={theme}>{children}</ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};