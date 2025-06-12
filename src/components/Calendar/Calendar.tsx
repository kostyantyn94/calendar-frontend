import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { CalendarDayComponent } from './CalendarDay';
import { Modal } from '../common/Modal';
import { TaskForm } from '../Task/TaskForm';
import { TaskDetails } from '../Task/TaskDetails';
import { Task, Holiday, CalendarDay, TaskFormData, CalendarView } from '../../types';
import { theme } from '../../styles/theme';
import { useSettings } from '../../contexts/SettingsContext';
import { taskApi, holidayApi } from '../../services/api';
import { getCalendarDays, getWeekDays, createCalendarDay, formatDate, formatWeekRange, getWeekdayNames } from '../../utils/dateUtils';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useRecurringTasks } from '../../hooks/useRecurringTasks';

const CalendarContainer = styled.div`
    max-width: 1500px;
    margin: 0 auto;
    padding: ${theme.spacing.md};
    min-height: 100vh;
    
    /* Account for fixed navigation buttons */
    padding-top: 80px;

    @media (min-width: 480px) {
        padding: ${theme.spacing.lg};
        padding-top: 90px;
    }

    @media (min-width: 768px) {
        padding: ${theme.spacing.xl} ${theme.spacing.lg};
        padding-top: 40px;
    }
    
    @media (min-width: 1024px) {
        padding: ${theme.spacing.xl};
    }
`;

const Header = styled.header`
    background-color: ${theme.colors.secondary};
    color: white;
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: ${theme.shadows.md};
    flex-wrap: wrap;
    gap: ${theme.spacing.sm};
    
    @media (min-width: 768px) {
        padding: ${theme.spacing.lg};
        flex-wrap: nowrap;
        gap: 0;
    }
`;

const Title = styled.h1`
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    margin: 0;
    
    @media (min-width: 480px) {
        font-size: 24px;
    }
    
    @media (min-width: 768px) {
        font-size: 28px;
    }
`;

const Navigation = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    
    @media (min-width: 768px) {
        gap: ${theme.spacing.md};
        flex-wrap: nowrap;
    }
`;

const NavButton = styled.button`
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all ${theme.transitions.fast};
    min-height: 36px; /* Touch-friendly */
    
    @media (min-width: 768px) {
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: 16px;
        min-height: 40px;
    }

    &:hover {
        background-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
    
    /* Remove hover effects on touch devices */
    @media (hover: none) {
        &:hover {
            transform: none;
        }
    }
`;

const MonthYear = styled.span`
    font-size: 16px;
    font-weight: 600;
    min-width: 120px;
    text-align: center;
    
    @media (min-width: 480px) {
        font-size: 18px;
        min-width: 160px;
    }
    
    @media (min-width: 768px) {
        font-size: 22px;
        min-width: 200px;
    }
`;

const Controls = styled.div`
    margin: ${theme.spacing.md} 0;
    display: flex;
    gap: ${theme.spacing.sm};
    align-items: stretch;
    flex-direction: column;
    
    @media (min-width: 768px) {
        flex-direction: row;
        gap: ${theme.spacing.md};
        margin: ${theme.spacing.lg} 0;
    }
`;

const ViewSwitcher = styled.div`
    display: flex;
    border-radius: ${theme.borderRadius.sm};
    overflow: hidden;
    border: 1px solid ${theme.colors.border};
    align-self: stretch;
    
    @media (min-width: 768px) {
        align-self: auto;
    }
`;

const ViewButton = styled.button<{ active: boolean }>`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: none;
    background-color: ${props => props.active ? theme.colors.primary : 'white'};
    color: ${props => props.active ? 'white' : theme.colors.text.primary};
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all ${theme.transitions.fast};
    flex: 1;
    min-height: 44px; /* Touch-friendly */

    @media (min-width: 768px) {
        flex: none;
        min-height: 40px;
    }

    &:hover {
        background-color: ${props => props.active ? theme.colors.primary : theme.colors.surface};
    }

    &:first-of-type {
        border-right: 1px solid ${theme.colors.border};
    }
`;

const SearchInput = styled.input`
    flex: 1;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: 16px;
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border};
    transition: all ${theme.transitions.fast};
    min-height: 44px; /* Touch-friendly */

    @media (min-width: 768px) {
        min-height: 40px;
    }

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
`;

const CountrySelect = styled.select`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: 16px;
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border};
    background-color: white;
    cursor: pointer;
    min-height: 44px; /* Touch-friendly */
    min-width: 120px;

    @media (min-width: 768px) {
        min-height: 40px;
        min-width: 140px;
    }

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;

const CalendarGrid = styled.div`
    background-color: white;
    border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.lg};
    overflow: hidden;
    animation: fadeIn 0.3s ease;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const WeekdaysRow = styled.div<{ columns: number }>`
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    background-color: ${theme.colors.surface};
    border-bottom: 2px solid ${theme.colors.border};
`;

const Weekday = styled.div`
    padding: ${theme.spacing.sm} ${theme.spacing.xs};
    text-align: center;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    @media (min-width: 480px) {
        padding: ${theme.spacing.sm} ${theme.spacing.sm};
        font-size: 13px;
    }
    
    @media (min-width: 768px) {
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: 15px;
    }
`;

const DaysGrid = styled.div<{ view: CalendarView; columns: number }>`
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    grid-auto-rows: ${props => {
        if (props.view === 'week') {
            return window.innerWidth < 768 ? '300px' : '400px';
        }
        return window.innerWidth < 480 ? '120px' : window.innerWidth < 768 ? '140px' : '180px';
    }};
    gap: ${props => props.view === 'week' ? theme.spacing.sm : '1px'};
    padding: ${props => props.view === 'week' ? theme.spacing.sm : 0};
    
    @media (min-width: 768px) {
        grid-auto-rows: ${props => props.view === 'week' ? '400px' : '180px'};
        gap: ${props => props.view === 'week' ? theme.spacing.md : theme.spacing.sm};
        padding: ${props => props.view === 'week' ? theme.spacing.md : theme.spacing.sm};
    }
    
    ${props => props.view === 'week' && `
        border-radius: ${theme.borderRadius.lg};
        box-shadow: ${theme.shadows.lg};
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        margin: ${theme.spacing.md} 0;
    `}
`;

const WeekContainer = styled.div`
    background: white;
    border-radius: ${theme.borderRadius.lg};
    overflow: hidden;
    box-shadow: ${theme.shadows.lg};
    position: relative;
    animation: slideIn 0.3s ease;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, 
            ${theme.colors.primary} 0%, 
            ${theme.colors.secondary} 100%
        );
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const WeekHeader = styled.div`
    padding: ${theme.spacing.md};
    background: linear-gradient(135deg, 
        ${theme.colors.primary}15 0%, 
        ${theme.colors.secondary}15 100%
    );
    text-align: center;
    
    @media (min-width: 768px) {
        padding: ${theme.spacing.lg};
    }

    h2 {
        margin: 0 0 ${theme.spacing.xs} 0;
        color: ${theme.colors.text.primary};
        font-size: 18px;
        font-weight: 600;
        
        @media (min-width: 768px) {
            font-size: 22px;
        }
    }

    p {
        margin: 0;
        color: ${theme.colors.text.secondary};
        font-size: 14px;
        
        @media (min-width: 768px) {
            font-size: 16px;
        }
    }
`;

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid ${theme.colors.border};
    border-top: 4px solid ${theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    
    @media (min-width: 768px) {
        width: 60px;
        height: 60px;
        border-width: 6px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const ErrorMessage = styled.div`
    padding: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
    background-color: #fee;
    color: ${theme.colors.danger};
    border-radius: ${theme.borderRadius.sm};
    text-align: center;
    font-size: 14px;
    
    @media (min-width: 768px) {
        font-size: 16px;
    }
`;

type ModalType = 'create' | 'edit' | 'view' | null;

export const Calendar: React.FC = () => {
    const { settings } = useSettings();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<CalendarView>('month');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [countryCode, setCountryCode] = useState('UA');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // Fetch tasks only
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const tasksData = await taskApi.getTasksByMonth(year, month);
            setTasks(tasksData);
        } catch (err) {
            setError('Failed to load data. Please try again.');
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [year, month]);

    // Separate fetch for holidays when country changes
    const fetchHolidays = useCallback(async () => {
        setIsLoadingHolidays(true);
        try {
            const holidaysData = await holidayApi.getHolidays(year, countryCode);
            setHolidays(holidaysData);
        } catch (err) {
            console.error('Error fetching holidays:', err);
        } finally {
            setIsLoadingHolidays(false);
        }
    }, [year, countryCode]);

    useEffect(() => {
        fetchData();
    }, [year, month]);

    // Separate effect for holidays when country changes
    useEffect(() => {
        if (year && countryCode) {
            fetchHolidays();
        }
    }, [fetchHolidays]);

    // Handle task reordering
    const handleTaskReorder = useCallback(async (updates: any[]) => {
        try {
            // Use the reorderTasks API method for better performance
            const updatedTasks = await taskApi.reorderTasks(updates);
            
            // Update local state with the reordered tasks
            setTasks(prevTasks => {
                const taskMap = new Map(prevTasks.map(t => [t._id, t]));
                
                // Update the modified tasks
                updatedTasks.forEach(task => {
                    if (task) {
                        taskMap.set(task._id, task);
                    }
                });
                
                return Array.from(taskMap.values());
            });
        } catch (err: any) {
            console.error('Error reordering tasks:', err);
            setError('Failed to reorder tasks: ' + (err.response?.data?.error || err.message));
        }
    }, []);

    // Initialize drag and drop
    const {
        dragState,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
    } = useDragAndDrop(handleTaskReorder);

    // Navigation
    const navigateMonth = (direction: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };

    const navigateWeek = (direction: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (direction * 7));
            return newDate;
        });
    };

    const navigate = (direction: number) => {
        if (currentView === 'month') {
            navigateMonth(direction);
        } else {
            navigateWeek(direction);
        }
    };

    const handleViewChange = (view: CalendarView) => {
        setCurrentView(view);
    };

    // Modal handlers
    const openCreateModal = (date: string) => {
        setSelectedDate(date);
        setSelectedTask(null);
        setModalType('create');
    };

    const openViewModal = (task: Task) => {
        setSelectedTask(task);
        setModalType('view');
    };

    const openEditModal = () => {
        // Устанавливаем selectedDate в дату выбранной задачи при переходе в режим редактирования
        if (selectedTask) {
            console.log('Opening edit modal for task:', selectedTask); // Debug log
            console.log('Setting selectedDate to:', selectedTask.date); // Debug log
            setSelectedDate(selectedTask.date);
        }
        setModalType('edit');
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedTask(null);
        setSelectedDate(null);
    };

    // Task management
    const handleTaskCreate = async (formData: TaskFormData) => {
        try {
            console.log('Creating task with data:', formData);
            const newTask = await taskApi.createTask(formData);
            console.log('Task created successfully:', newTask);

            // If this is a recurring task, generate initial instances
            if (formData.recurrence && formData.recurrence.type !== 'none') {
                try {
                    console.log('Generating recurring instances for task:', newTask._id);
                    
                    // Generate instances for the current view period and a bit beyond
                    const startDate = viewDateRange.startDate.toISOString().split('T')[0];
                    const endDate = new Date(viewDateRange.endDate);
                    endDate.setMonth(endDate.getMonth() + 6); // Generate 6 months ahead
                    const endDateStr = endDate.toISOString().split('T')[0];
                    
                    await taskApi.generateRecurringInstances(newTask._id, startDate, endDateStr);
                    console.log('Recurring instances generated successfully');
                    
                    // Refresh tasks to show the new instances
                    await fetchData();
                } catch (recurringErr) {
                    console.error('Error generating recurring instances:', recurringErr);
                    // Still add the main task even if recurring generation fails
                    setTasks(prev => [...prev, newTask]);
                }
            } else {
                // Add to local state for non-recurring tasks
                setTasks(prev => [...prev, newTask]);
            }
            
            closeModal();
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Failed to create task.');
        }
    };

    const handleTaskUpdate = async (formData: TaskFormData) => {
        if (!selectedTask) return;

        try {
            console.log('Updating task with data:', formData);
            const updatedTask = await taskApi.updateTask(selectedTask._id, formData);
            console.log('Task updated successfully:', updatedTask);
            
            // If this task was changed to/from recurring, we need to refresh all tasks
            // to properly handle recurring instances
            const wasRecurring = selectedTask.recurrence && selectedTask.recurrence.type !== 'none';
            const isNowRecurring = formData.recurrence && formData.recurrence.type !== 'none';
            
            if (wasRecurring || isNowRecurring) {
                console.log('Recurring task updated, refreshing all tasks');
                await fetchData();
            } else {
                // Simple update for non-recurring tasks
                setTasks(prev => prev.map(task =>
                    task._id === selectedTask._id ? updatedTask : task
                ));
            }
            
            setSelectedTask(updatedTask);
            setModalType('view');
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task.');
        }
    };

    const handleTaskDelete = async () => {
        if (!selectedTask) return;

        try {
            await taskApi.deleteTask(selectedTask._id);
            setTasks(prev => prev.filter(task => task._id !== selectedTask._id));
            closeModal();
        } catch (err) {
            console.error('Error deleting task:', err);
            setError('Failed to delete task.');
        }
    };

    const handleTaskToggleComplete = async () => {
        if (!selectedTask) return;

        try {
            const updatedTask = await taskApi.updateTask(selectedTask._id, {
                ...selectedTask,
                completed: !selectedTask.completed,
            });
            setTasks(prev => prev.map(task =>
                task._id === selectedTask._id ? updatedTask : task
            ));
            setSelectedTask(updatedTask);
        } catch (err) {
            console.error('Error updating task:', err);
            setError('Failed to update task.');
        }
    };

    // Calculate view date range for recurring tasks
    const viewDateRange = React.useMemo(() => {
        const days = currentView === 'month' 
            ? getCalendarDays(year, month, settings.startWeekOnMonday)
            : getWeekDays(currentDate, settings.startWeekOnMonday);
        
        const startDate = days[0];
        const endDate = days[days.length - 1];
        
        return { startDate, endDate };
    }, [year, month, currentDate, currentView, settings.startWeekOnMonday]);

    // Expand tasks with recurring instances
    const expandedTasks = useRecurringTasks(tasks, viewDateRange.startDate, viewDateRange.endDate);

    // Get calendar days
    const calendarDays = React.useMemo(() => {
        const days = currentView === 'month' 
            ? getCalendarDays(year, month, settings.startWeekOnMonday)
            : getWeekDays(currentDate, settings.startWeekOnMonday);
        
        // Filter out weekends if setting is disabled
        const filteredDays = settings.showWeekends 
            ? days 
            : days.filter(date => {
                const dayOfWeek = date.getDay();
                return dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday or Saturday
            });
        
        return filteredDays.map(date => createCalendarDay(date, currentDate, expandedTasks, holidays));
    }, [year, month, currentDate, currentView, expandedTasks, holidays, settings.startWeekOnMonday, settings.showWeekends]);

    const weekdays = getWeekdayNames(true, settings.startWeekOnMonday);
    
    // Filter weekdays if weekends are hidden
    const filteredWeekdays = settings.showWeekends 
        ? weekdays 
        : weekdays.filter(day => !['Sat', 'Sun'].includes(day));

    return (
        <CalendarContainer>
            {isLoading && (
                <LoadingOverlay>
                    <LoadingSpinner />
                </LoadingOverlay>
            )}

            <Header>
                <Title>
                    <span>📅</span>
                    Calendar
                </Title>
                <Navigation>
                    <NavButton onClick={() => navigate(-1)}>
                        ← Previous
                    </NavButton>
                    <MonthYear>
                        {currentView === 'month' 
                            ? formatDate(currentDate, 'MMMM yyyy')
                            : formatWeekRange(currentDate)
                        }
                    </MonthYear>
                    <NavButton onClick={() => navigate(1)}>
                        Next →
                    </NavButton>
                </Navigation>
            </Header>

            <Controls>
                <ViewSwitcher>
                    <ViewButton 
                        active={currentView === 'month'}
                        onClick={() => handleViewChange('month')}
                    >
                        Month
                    </ViewButton>
                    <ViewButton 
                        active={currentView === 'week'}
                        onClick={() => handleViewChange('week')}
                    >
                        Week
                    </ViewButton>
                </ViewSwitcher>
                
                <SearchInput
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <CountrySelect
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={isLoadingHolidays}
                    >
                        <option value="UA">Ukraine</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="JP">Japan</option>
                    </CountrySelect>
                    {isLoadingHolidays && (
                        <div style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '12px'
                        }}>
                            ⏳
                        </div>
                    )}
                </div>
            </Controls>

            {error && (
                <ErrorMessage>
                    {error}
                </ErrorMessage>
            )}

            {currentView === 'week' ? (
                <WeekContainer>
                    <WeekHeader>
                        <h2>Weekly View</h2>
                        <p>{formatWeekRange(currentDate)}</p>
                    </WeekHeader>
                    
                    <WeekdaysRow columns={filteredWeekdays.length}>
                        {filteredWeekdays.map(day => (
                            <Weekday key={day}>{day}</Weekday>
                        ))}
                    </WeekdaysRow>

                    <DaysGrid view={currentView} columns={filteredWeekdays.length}>
                        {calendarDays.map((day, index) => (
                            <CalendarDayComponent
                                key={index}
                                day={day}
                                searchTerm={searchTerm}
                                onTaskCreate={openCreateModal}
                                onTaskClick={openViewModal}
                                onTaskDragStart={(e: React.DragEvent<HTMLDivElement>, task: Task, sourceDate: string, sourceIndex: number) => 
                                    handleDragStart(e, task, sourceDate, sourceIndex)
                                }
                                onTaskDragEnd={handleDragEnd}
                                onDayDrop={(e: React.DragEvent<HTMLDivElement>, date: string, tasks: Task[], targetIndex?: number) => 
                                    handleDrop(e, date, tasks, targetIndex)
                                }
                                draggedTask={dragState.draggedTask}
                            />
                        ))}
                    </DaysGrid>
                </WeekContainer>
            ) : (
                <CalendarGrid>
                    <WeekdaysRow columns={filteredWeekdays.length}>
                        {filteredWeekdays.map(day => (
                            <Weekday key={day}>{day}</Weekday>
                        ))}
                    </WeekdaysRow>

                    <DaysGrid view={currentView} columns={filteredWeekdays.length}>
                        {calendarDays.map((day, index) => (
                            <CalendarDayComponent
                                key={index}
                                day={day}
                                searchTerm={searchTerm}
                                onTaskCreate={openCreateModal}
                                onTaskClick={openViewModal}
                                onTaskDragStart={(e: React.DragEvent<HTMLDivElement>, task: Task, sourceDate: string, sourceIndex: number) => 
                                    handleDragStart(e, task, sourceDate, sourceIndex)
                                }
                                onTaskDragEnd={handleDragEnd}
                                onDayDrop={(e: React.DragEvent<HTMLDivElement>, date: string, tasks: Task[], targetIndex?: number) => 
                                    handleDrop(e, date, tasks, targetIndex)
                                }
                                draggedTask={dragState.draggedTask}
                            />
                        ))}
                    </DaysGrid>
                </CalendarGrid>
            )}

            {/* Create/Edit Task Modal */}
            {(modalType === 'create' || modalType === 'edit') && (() => {
                const taskFormProps = {
                    task: modalType === 'edit' ? selectedTask || undefined : undefined,
                    initialDate: selectedDate || new Date().toISOString().split('T')[0]
                };
                console.log('Rendering TaskForm with props:', taskFormProps); // Debug log
                console.log('Current modalType:', modalType, 'selectedTask:', selectedTask, 'selectedDate:', selectedDate); // Debug log
                
                return (
                    <Modal
                        isOpen={true}
                        onClose={closeModal}
                        title={modalType === 'create' ? 'Create New Task' : 'Edit Task'}
                    >
                        <TaskForm
                            task={taskFormProps.task}
                            initialDate={taskFormProps.initialDate}
                            onSubmit={modalType === 'create' ? handleTaskCreate : handleTaskUpdate}
                            onCancel={closeModal}
                        />
                    </Modal>
                );
            })()}

            {/* View Task Modal */}
            {modalType === 'view' && selectedTask && (
                <Modal
                    isOpen={true}
                    onClose={closeModal}
                    title="Task Details"
                >
                    <TaskDetails
                        task={selectedTask}
                        onEdit={openEditModal}
                        onDelete={handleTaskDelete}
                        onClose={closeModal}
                        onToggleComplete={handleTaskToggleComplete}
                    />
                </Modal>
            )}
        </CalendarContainer>
    );
};