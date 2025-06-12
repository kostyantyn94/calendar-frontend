import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { CalendarDay as CalendarDayType, Task } from '../../types';
import { TaskComponent } from '../Task/Task';
import { DragPlaceholder } from '../common/DragPlaceholder';
import { theme } from '../../styles/theme';
import { useSettings } from '../../contexts/SettingsContext';
import { format } from '../../utils/dateUtils';

interface CalendarDayProps {
    day: CalendarDayType;
    onTaskCreate: (date: string) => void;
    onTaskClick: (task: Task) => void;
    onTaskDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task, sourceDate: string, sourceIndex: number) => void;
    onTaskDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDayDrop: (e: React.DragEvent<HTMLDivElement>, date: string, tasks: Task[], targetIndex?: number) => void;
    searchTerm: string;
    draggedTask: Task | null;
}

const DayContainer = styled.div<{
    isToday: boolean;
    isWeekend: boolean;
    isCurrentMonth: boolean;
}>`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    padding: ${theme.spacing.xs};
    min-height: 120px;
    max-height: 120px;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all ${theme.transitions.fast};
    
    background-color: ${props =>
        props.isToday
            ? theme.colors.calendar.today
            : props.isWeekend
                ? theme.colors.calendar.weekend
                : props.isCurrentMonth
                    ? theme.colors.background
                    : theme.colors.calendar.otherMonth};
    opacity: ${props => (props.isCurrentMonth ? 1 : 0.6)};

    @media (min-width: 480px) {
        padding: ${theme.spacing.sm};
        min-height: 140px;
        max-height: 140px;
    }

    @media (min-width: 768px) {
        padding: calc(${theme.spacing.sm} * var(--spacing-multiplier, 1));
        min-height: calc(180px * var(--spacing-multiplier, 1));
        max-height: calc(180px * var(--spacing-multiplier, 1));
    }

    &:hover {
        background-color: ${props =>
            props.isCurrentMonth ? theme.colors.calendar.hover : undefined};
    }
    
    /* Remove hover effects on touch devices */
    @media (hover: none) {
        &:hover {
            background-color: ${props =>
                props.isToday
                    ? theme.colors.calendar.today
                    : props.isWeekend
                        ? theme.colors.calendar.weekend
                        : props.isCurrentMonth
                            ? theme.colors.background
                            : theme.colors.calendar.otherMonth};
        }
    }
`;

const DayHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${theme.spacing.xs};
    flex-shrink: 0;
    gap: ${theme.spacing.xs};
    
    @media (min-width: 768px) {
        margin-bottom: ${theme.spacing.xs};
    }
`;

const DayNumber = styled.span<{ isToday: boolean }>`
    font-weight: 600;
    color: ${props => (props.isToday ? theme.colors.primary : theme.colors.text.primary)};
    font-size: 14px;
    line-height: 1;
    
    @media (min-width: 480px) {
        font-size: 15px;
    }
    
    @media (min-width: 768px) {
        font-size: 16px;
    }
`;

const TaskCount = styled.span`
    font-size: 10px;
    color: ${theme.colors.text.light};
    background-color: ${theme.colors.surface};
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
    
    @media (min-width: 480px) {
        font-size: 11px;
        padding: 3px 7px;
        border-radius: 12px;
    }
    
    @media (min-width: 768px) {
        font-size: 12px;
        padding: 3px 8px;
        border-radius: 12px;
    }
`;

const HolidayBadge = styled.div`
    font-size: 9px;
    color: ${theme.colors.danger};
    font-weight: 600;
    background-color: #ffe5e5;
    padding: 2px 4px;
    border-radius: ${theme.borderRadius.sm};
    margin-bottom: ${theme.spacing.xs};
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    line-height: 1.2;
    flex-shrink: 0;
    
    @media (min-width: 480px) {
        font-size: 10px;
        padding: 2px 5px;
    }
    
    @media (min-width: 768px) {
        font-size: 10px;
        padding: 2px 6px;
    }
`;

const TasksContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 20px;
    transition: all ${theme.transitions.fast};
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    padding-right: 2px;
    margin-right: -2px;
    margin-bottom: ${theme.spacing.xs};
    position: relative;
    
    @media (min-width: 480px) {
        gap: 3px;
        padding-right: 3px;
        margin-right: -3px;
        margin-bottom: ${theme.spacing.sm};
    }

    @media (min-width: 768px) {
        gap: var(--task-spacing, ${theme.spacing.xs});
        padding-right: 4px;
        margin-right: -4px;
        margin-bottom: calc(${theme.spacing.sm} * var(--spacing-multiplier, 1));
    }

    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 3px;
        
        @media (min-width: 768px) {
            width: 4px;
        }
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: ${theme.colors.border};
        border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.text.light};
    }

    .task-item {
        width: 100%;
    }
`;

const DropZone = styled.div<{ isActive: boolean }>`
    min-height: 20px;
    width: 100%;
    border-radius: ${theme.borderRadius.sm};
    transition: all ${theme.transitions.fast};
    background-color: ${props => props.isActive ? theme.colors.primary + '10' : 'transparent'};
    border: ${props => props.isActive ? '2px dashed ' + theme.colors.primary : '2px dashed transparent'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: ${theme.colors.text.light};
    margin-top: ${theme.spacing.xs};
    
    @media (min-width: 480px) {
        font-size: 11px;
    }
    
    @media (min-width: 768px) {
        font-size: 12px;
    }
`;

const AddTaskButton = styled.button`
    background-color: ${theme.colors.surface};
    color: ${theme.colors.text.secondary};
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    font-size: 10px;
    cursor: pointer;
    border: 1px solid ${theme.colors.border};
    width: 100%;
    text-align: center;
    transition: all ${theme.transitions.fast};
    margin-top: auto;
    margin-bottom: ${theme.spacing.xs};
    flex-shrink: 0;
    min-height: 24px; /* Touch-friendly on mobile */
    line-height: 1;
    
    @media (min-width: 480px) {
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: 11px;
        min-height: 26px;
    }
    
    @media (min-width: 768px) {
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: 12px;
        min-height: 28px;
    }

    &:hover {
        background-color: #e8e9ea;
        color: ${theme.colors.text.primary};
    }

    &:active {
        transform: scale(0.98);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }
    
    /* Remove hover effects on touch devices */
    @media (hover: none) {
        &:hover {
            background-color: ${theme.colors.surface};
            color: ${theme.colors.text.secondary};
        }
        
        &:active {
            background-color: #e8e9ea;
            color: ${theme.colors.text.primary};
        }
    }
`;

const TaskInput = styled.input`
    width: 100%;
    padding: 4px 6px;
    font-size: 11px;
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border};
    margin-top: ${theme.spacing.xs};
    min-height: 28px; /* Touch-friendly */
    
    @media (min-width: 480px) {
        padding: 5px 8px;
        font-size: 12px;
        min-height: 30px;
    }
    
    @media (min-width: 768px) {
        padding: 6px 10px;
        font-size: 13px;
        min-height: 32px;
    }

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }
`;

const DropIndicator = styled.div<{ isVisible: boolean }>`
    position: absolute;
    top: ${theme.spacing.xs};
    left: ${theme.spacing.xs};
    right: ${theme.spacing.xs};
    bottom: ${theme.spacing.xs};
    border: 2px dashed ${theme.colors.primary};
    border-radius: ${theme.borderRadius.sm};
    background-color: ${theme.colors.primary}10;
    pointer-events: none;
    opacity: ${props => props.isVisible ? 1 : 0};
    transition: opacity ${theme.transitions.fast};
    
    @media (min-width: 768px) {
        top: ${theme.spacing.sm};
        left: ${theme.spacing.sm};
        right: ${theme.spacing.sm};
        bottom: ${theme.spacing.sm};
    }
`;

export const CalendarDayComponent: React.FC<CalendarDayProps> = ({
    day,
    searchTerm,
    onTaskCreate,
    onTaskClick,
    onTaskDragStart,
    onTaskDragEnd,
    onDayDrop,
    draggedTask
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDropTarget, setIsDropTarget] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [showAddButton, setShowAddButton] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const { settings } = useSettings();

    const isToday = day.isToday;
    const isWeekend = day.isWeekend;
    const isCurrentMonth = day.isCurrentMonth;

    // Filter tasks based on search term
    const filteredTasks = day.tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        setShowAddButton(isHovered && !isAddingTask);
    }, [isHovered, isAddingTask]);

    const handleAddClick = () => {
        setIsAddingTask(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (!draggedTask) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        setIsDropTarget(true);
        
        const container = e.currentTarget;
        const tasksContainer = container.querySelector('[data-tasks-container]') as HTMLElement;
        
        if (!tasksContainer) return;
        
        const rect = tasksContainer.getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        const taskElements = Array.from(tasksContainer.children).filter(child => 
            (child as HTMLElement).dataset.taskElement === 'true'
        ) as HTMLElement[];
        
        let insertIndex = filteredTasks.length;
        
        for (let i = 0; i < taskElements.length; i++) {
            const taskRect = taskElements[i].getBoundingClientRect();
            const taskY = taskRect.top - rect.top;
            
            if (y < taskY + taskRect.height / 2) {
                insertIndex = i;
                break;
            }
        }
        
        setDragOverIndex(insertIndex);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        if (!draggedTask) return;
        
        e.preventDefault();
        e.stopPropagation();
        setIsDropTarget(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!draggedTask) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Only hide drop indicator if we're leaving the entire day container
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setIsDropTarget(false);
            setDragOverIndex(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (!draggedTask) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        setIsDropTarget(false);
        setDragOverIndex(null);
        
        onDayDrop(e, format(day.date, 'yyyy-MM-dd'), filteredTasks, dragOverIndex !== null ? dragOverIndex : undefined);
    };

    const handleTaskDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        if (!draggedTask) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        setIsDropTarget(false);
        setDragOverIndex(null);
        
        onDayDrop(e, format(day.date, 'yyyy-MM-dd'), filteredTasks, targetIndex);
    };

    const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            onTaskCreate(format(day.date, 'yyyy-MM-dd'));
            setNewTaskTitle('');
            setIsAddingTask(false);
        } else if (e.key === 'Escape') {
            setNewTaskTitle('');
            setIsAddingTask(false);
        }
    };

    const handleInputBlur = () => {
        if (newTaskTitle.trim()) {
            onTaskCreate(format(day.date, 'yyyy-MM-dd'));
        }
        setNewTaskTitle('');
        setIsAddingTask(false);
    };

    return (
        <DayContainer
            isToday={isToday}
            isWeekend={isWeekend}
            isCurrentMonth={isCurrentMonth}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <DayHeader>
                <DayNumber isToday={isToday}>
                    {day.dayNumber}
                </DayNumber>
                {filteredTasks.length > 0 && (
                    <TaskCount>
                        {filteredTasks.length}
                    </TaskCount>
                )}
            </DayHeader>

            {day.holidays && day.holidays.length > 0 && (
                <HolidayBadge>
                    {day.holidays[0].name}
                </HolidayBadge>
            )}

            <TasksContainer data-tasks-container>
                {filteredTasks.map((task, index) => (
                    <React.Fragment key={task._id}>
                        {dragOverIndex === index && (
                            <DragPlaceholder />
                        )}
                        <div
                            data-task-element="true"
                            className="task-item"
                        >
                            <TaskComponent
                                task={task}
                                onClick={() => onTaskClick(task)}
                                onDragStart={(e: React.DragEvent<HTMLDivElement>) => 
                                    onTaskDragStart(e, task, format(day.date, 'yyyy-MM-dd'), index)
                                }
                                onDragEnd={onTaskDragEnd}
                                onDrop={(e: React.DragEvent<HTMLDivElement>) => 
                                    handleTaskDrop(e, index)
                                }
                            />
                        </div>
                    </React.Fragment>
                ))}
                {dragOverIndex === filteredTasks.length && (
                    <DragPlaceholder />
                )}
            </TasksContainer>

            {isAddingTask ? (
                <TaskInput
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleInputSubmit}
                    onBlur={handleInputBlur}
                    placeholder="Task title..."
                    autoFocus
                />
            ) : (
                <AddTaskButton 
                    onClick={handleAddClick}
                    style={{ 
                        display: filteredTasks.length > 0 || showAddButton || window.innerWidth < 768 ? 'block' : 'none' 
                    }}
                >
                    + Add Task
                </AddTaskButton>
            )}

            <DropIndicator isVisible={isDropTarget} />
        </DayContainer>
    );
};