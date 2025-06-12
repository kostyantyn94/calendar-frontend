import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Task as TaskType } from '../../types';
import { theme } from '../../styles/theme';

interface TaskProps {
    task: TaskType;
    onClick: (task: TaskType) => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, task: TaskType) => void;
    onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const TaskContainer = styled.div<{ priority: string; isDragging?: boolean; completed: boolean }>`
    background-color: white;
    border: 1px solid ${theme.colors.border};
    border-left: 3px solid ${props => theme.colors.priority[props.priority as keyof typeof theme.colors.priority]};
    padding: calc(4px * var(--spacing-multiplier, 1)) calc(8px * var(--spacing-multiplier, 1));
    border-radius: ${theme.borderRadius.sm};
    margin-bottom: var(--task-spacing, 2px);
    font-size: calc(12px * var(--spacing-multiplier, 1));
    cursor: move;
    position: relative;
    transition: all var(--transition-duration, ${theme.transitions.fast});
    opacity: ${props => props.isDragging ? 0.5 : props.completed ? 0.7 : 1};
    transform: ${props => props.isDragging ? 'rotate(2deg) scale(0.95)' : 'none'};
    width: 100%;
    box-sizing: border-box;
    min-height: calc(26px * var(--spacing-multiplier, 1));
    display: flex;
    align-items: center;

    &:hover {
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.sm};
        z-index: 10;
    }

    &:active {
        cursor: grabbing;
    }
`;

const TaskTitle = styled.span<{ completed: boolean }>`
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${theme.colors.text.primary};
    text-decoration: ${props => props.completed ? 'line-through' : 'none'};
    max-width: 100%;
    word-break: break-all;
`;

const CompletedBadge = styled.span`
    position: absolute;
    top: 4px;
    right: 4px;
    color: ${theme.colors.success};
    font-size: 12px;
`;

const RecurringBadge = styled.span<{ hasCompleted: boolean }>`
    position: absolute;
    top: 4px;
    right: ${props => props.hasCompleted ? '20px' : '4px'};
    color: ${theme.colors.primary};
    font-size: 10px;
    opacity: 0.7;
`;

export const TaskComponent: React.FC<TaskProps> = ({
                                                       task,
                                                       onClick,
                                                       onDragStart,
                                                       onDragEnd,
                                                       onDragOver,
                                                       onDragLeave,
                                                       onDrop,
                                                   }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        onDragStart(e, task);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (onDragEnd) {
            onDragEnd(e);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick(task);
    };

    return (
        <TaskContainer
            priority={task.priority}
            isDragging={isDragging}
            completed={task.completed}
            data-task-id={task._id}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={handleClick}
        >
            <TaskTitle completed={task.completed}>{task.title}</TaskTitle>
            {task.completed && <CompletedBadge>✓</CompletedBadge>}
            {(task.recurrence?.type !== 'none' && task.recurrence) && (
                <RecurringBadge hasCompleted={task.completed} title="Recurring task">🔁</RecurringBadge>
            )}
        </TaskContainer>
    );
};