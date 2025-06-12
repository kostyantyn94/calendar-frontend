import React from 'react';
import styled from '@emotion/styled';
import { Task, TaskPriority } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from '../../utils/dateUtils';
import { getRecurrenceDescription } from '../../utils/recurrenceUtils';

interface TaskDetailsProps {
    task: Task;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
    onToggleComplete: () => void;
}

const Container = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Header = styled.div<{ theme: any }>`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h3<{ completed: boolean; theme: any }>`
  margin: 0;
  font-size: 24px;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  opacity: ${props => props.completed ? 0.6 : 1};
`;

const PriorityBadge = styled.span<{ priority: TaskPriority; theme: any }>`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.priority[props.priority]};
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const MetaInfo = styled.div<{ theme: any }>`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text.secondary};
  font-size: 14px;
`;

const Description = styled.div<{ theme: any }>`
  background-color: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.sm};
  min-height: 100px;
  white-space: pre-wrap;
  line-height: 1.6;
  color: ${props => props.theme.colors.text.primary};
  
  &:empty::before {
    content: 'No description provided';
    color: ${props => props.theme.colors.text.secondary};
    font-style: italic;
  }
`;

const Actions = styled.div<{ theme: any }>`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  justify-content: space-between;
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionGroup = styled.div<{ theme: any }>`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'success'; theme: any }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => {
    switch (props.variant) {
        case 'danger':
            return `
          background-color: ${props.theme.colors.danger};
          color: white;
          
          &:hover {
            background-color: #c0392b;
          }
        `;
        case 'success':
            return `
          background-color: ${props.theme.colors.success};
          color: white;
          
          &:hover {
            background-color: #229954;
          }
        `;
        case 'primary':
        default:
            return `
          background-color: ${props.theme.colors.primary};
          color: white;
          
          &:hover {
            background-color: #3a7bc8;
          }
        `;
    }
}}
`;

const CheckboxButton = styled.button<{ checked: boolean; theme: any }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.checked ? props.theme.colors.success : props.theme.colors.border};
  background-color: ${props => props.checked ? `${props.theme.colors.success}10` : props.theme.colors.background};
  color: ${props => props.checked ? props.theme.colors.success : props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.success};
    background-color: ${props => props.checked ? `${props.theme.colors.success}20` : `${props.theme.colors.success}05`};
  }
`;

const priorityLabels: Record<TaskPriority, string> = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    urgent: 'Urgent',
};

export const TaskDetails: React.FC<TaskDetailsProps> = ({
                                                            task,
                                                            onEdit,
                                                            onDelete,
                                                            onClose,
                                                            onToggleComplete,
                                                        }) => {
    const { theme } = useTheme();
    
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete();
        }
    };

    return (
        <Container theme={theme}>
            <Header theme={theme}>
                <TitleSection>
                    <Title completed={task.completed} theme={theme}>{task.title}</Title>
                    <MetaInfo theme={theme}>
                        <span>📅 {format(new Date(task.date), 'MMMM d, yyyy')}</span>
                        <span>•</span>
                        <span>Created {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                        {task.recurrence && task.recurrence.type !== 'none' && (
                            <>
                                <span>•</span>
                                <span>🔁 {getRecurrenceDescription(task.recurrence)}</span>
                            </>
                        )}
                    </MetaInfo>
                </TitleSection>
                <PriorityBadge priority={task.priority} theme={theme}>
                    {priorityLabels[task.priority]}
                </PriorityBadge>
            </Header>

            <Description theme={theme}>{task.description}</Description>

            <Actions theme={theme}>
                <CheckboxButton checked={task.completed} onClick={onToggleComplete} theme={theme}>
                    {task.completed ? '✓ Completed' : '○ Mark as Complete'}
                </CheckboxButton>

                <ActionGroup theme={theme}>
                    <Button onClick={onEdit} theme={theme}>Edit</Button>
                    <Button variant="danger" onClick={handleDelete} theme={theme}>Delete</Button>
                </ActionGroup>
            </Actions>
        </Container>
    );
};