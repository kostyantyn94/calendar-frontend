import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Calendar } from './components/Calendar/Calendar';
import { GlobalStyles } from './styles/GlobalStyles';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { AnalyticsDashboard } from './components/Analytics';
import styled from '@emotion/styled';

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const Navigation = styled.nav<{ theme: any }>`
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (min-width: 480px) {
    top: 16px;
    right: 16px;
    gap: 10px;
  }
  
  @media (min-width: 768px) {
    top: 20px;
    right: 20px;
    gap: 12px;
  }
`;

const NavButton = styled.button<{ theme: any; active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.active 
    ? props.theme.colors.primary 
    : `${props.theme.colors.surface}ee`}; /* Semi-transparent background */
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all ${props => props.theme.transitions.fast};
  box-shadow: ${props => props.theme.shadows.md};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* Touch-friendly sizing */
  @media (min-width: 480px) {
    width: 52px;
    height: 52px;
    font-size: 22px;
  }
  
  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 24px;
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  /* Hover effects only on non-touch devices */
  @media (hover: hover) {
    &:hover {
      background-color: ${props => props.active 
        ? props.theme.colors.primary 
        : `${props.theme.colors.calendar.hover}dd`};
      border-color: ${props => props.theme.colors.primary};
      box-shadow: ${props => props.theme.shadows.lg};
      transform: translateY(-2px);
    }
  }
  
  /* Touch feedback for touch devices */
  @media (hover: none) {
    &:active {
      transform: scale(0.95);
      box-shadow: ${props => props.theme.shadows.sm};
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  /* High contrast focus for accessibility */
  &:focus {
    outline: 3px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover,
    &:active {
      transform: none;
    }
  }
`;

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <AppContainer>
      <GlobalStyles />

      <Navigation theme={theme}>
        <NavButton 
          theme={theme} 
          active={location.pathname === '/'}
          onClick={() => navigate('/')}
          title="Calendar"
          aria-label="Go to Calendar"
        >
          📅
        </NavButton>
        <NavButton 
          theme={theme} 
          active={location.pathname === '/analytics'}
          onClick={() => navigate('/analytics')}
          title="Analytics Dashboard"
          aria-label="Go to Analytics Dashboard"
        >
          📊
        </NavButton>
        <NavButton 
          theme={theme} 
          onClick={() => setIsSettingsOpen(true)} 
          title="Settings"
          aria-label="Open Settings"
        >
          ⚙️
        </NavButton>
      </Navigation>

      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/analytics" element={<AnalyticsDashboard onClose={() => navigate('/')} />} />
      </Routes>

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </AppContainer>
  );
};

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <AppContent />
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;