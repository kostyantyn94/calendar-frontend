import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Task, TaskFormData, TaskPriority, RecurrenceRule } from '../../types';
import { theme } from '../../styles/theme';
import { RecurrenceSelector } from './RecurrenceSelector';

interface TaskFormProps {
    task?: Task;
    initialDate?: string;
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: ${theme.colors.text.primary};
`;

const Input = styled.input`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: 16px;
    transition: all ${theme.transitions.fast};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
`;

const TextArea = styled.textarea`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: 16px;
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
    transition: all ${theme.transitions.fast};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
`;

const PrioritySelector = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${theme.spacing.sm};
`;

const PriorityButton = styled.button<{ priority: TaskPriority; selected: boolean }>`
    padding: ${theme.spacing.sm};
    border: 2px solid ${props => props.selected ? theme.colors.priority[props.priority] : theme.colors.border};
    background-color: ${props => props.selected ? theme.colors.priority[props.priority] : 'white'};
    color: ${props => props.selected ? 'white' : theme.colors.text.primary};
    border-radius: ${theme.borderRadius.sm};
    font-weight: 500;
    cursor: pointer;
    transition: all ${theme.transitions.fast};

    &:hover {
        border-color: ${props => theme.colors.priority[props.priority]};
        background-color: ${props => props.selected ? theme.colors.priority[props.priority] : `${theme.colors.priority[props.priority]}20`};
    }
`;

const FormActions = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    justify-content: flex-end;
    margin-top: ${theme.spacing.md};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    border: none;
    border-radius: ${theme.borderRadius.sm};
    font-weight: 500;
    cursor: pointer;
    transition: all ${theme.transitions.fast};

    ${props => props.variant === 'primary' ? `
    background-color: ${theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: #3a7bc8;
    }
  ` : `
    background-color: ${theme.colors.surface};
    color: ${theme.colors.text.primary};
    
    &:hover {
      background-color: ${theme.colors.border};
    }
  `}
`;

const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

const formatDateForInput = (dateStr: string): string => {
    // Обрабатываем различные форматы даты и возвращаем YYYY-MM-DD
    if (!dateStr) return new Date().toISOString().split('T')[0];
    
    // Если уже в правильном формате YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    
    // Если в формате ISO (с временной зоной)
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    
    // Попытка парсинга как обычной даты
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
    }
    
    return date.toISOString().split('T')[0];
};

export const TaskForm: React.FC<TaskFormProps> = ({ task, initialDate, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<TaskFormData>(() => {
        // Initialize with proper values from the start
        return {
            title: task?.title || '',
            description: task?.description || '',
            priority: task?.priority || 'medium',
            date: formatDateForInput(task?.date || initialDate || ''),
            recurrence: task?.recurrence || { type: 'none', interval: 1 },
        };
    });

    console.log('TaskForm props:', { task, initialDate }); // Debug log
    console.log('Initial formData:', formData); // Debug log

    // Обновляем форму при изменении задачи (например, при переходе из режима просмотра в редактирование)
    useEffect(() => {
        if (task) {
            console.log('TaskForm useEffect triggered with task:', task); // Debug log
            const newFormData = {
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                date: formatDateForInput(task.date),
                recurrence: task.recurrence || { type: 'none', interval: 1 },
            };
            console.log('Setting new formData:', newFormData); // Debug log
            setFormData(newFormData);
        } else if (initialDate) {
            // Handle case when creating new task with initial date
            setFormData(prev => ({
                ...prev,
                date: formatDateForInput(initialDate),
                recurrence: { type: 'none', interval: 1 },
            }));
        }
    }, [task, initialDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        console.log('Submitting form data:', formData); // Debug log
        onSubmit(formData);
    };

    const handleChange = (field: keyof TaskFormData, value: string | TaskPriority | RecurrenceRule) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    required
                    autoFocus
                />
            </FormGroup>

            <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter task description..."
                />
            </FormGroup>

            <FormGroup>
                <Label>Priority</Label>
                <PrioritySelector>
                    {priorities.map(({ value, label }) => (
                        <PriorityButton
                            key={value}
                            type="button"
                            priority={value}
                            selected={formData.priority === value}
                            onClick={() => handleChange('priority', value)}
                        >
                            {label}
                        </PriorityButton>
                    ))}
                </PrioritySelector>
            </FormGroup>

            <FormGroup>
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label>Recurrence</Label>
                <RecurrenceSelector
                    value={formData.recurrence || { type: 'none', interval: 1 }}
                    onChange={(recurrence) => handleChange('recurrence', recurrence)}
                />
            </FormGroup>

            <FormActions>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    {task ? 'Update Task' : 'Create Task'}
                </Button>
            </FormActions>
        </Form>
    );
};