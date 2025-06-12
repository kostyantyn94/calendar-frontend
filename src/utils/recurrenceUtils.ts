import { RecurrenceRule, RecurrenceType, Task } from '../types';

/**
 * Generate recurring task dates based on recurrence rule
 */
export const generateRecurringDates = (
    startDate: string, 
    recurrence: RecurrenceRule, 
    maxDays: number = 365
): string[] => {
    if (recurrence.type === 'none') return [startDate];
    
    const dates: string[] = [];
    const start = new Date(startDate);
    let current = new Date(start);
    let count = 0;
    const maxCount = recurrence.count || 100; // Default max 100 occurrences
    const endDate = recurrence.endDate ? new Date(recurrence.endDate) : null;
    const maxDate = new Date(start.getTime() + (maxDays * 24 * 60 * 60 * 1000));
    
    while (count < maxCount && current <= maxDate) {
        if (endDate && current > endDate) break;
        
        const dateStr = current.toISOString().split('T')[0];
        
        // For weekly recurrence, check if current day matches weekdays
        if (recurrence.type === 'weekly' && recurrence.weekdays) {
            const dayOfWeek = current.getDay();
            if (recurrence.weekdays.includes(dayOfWeek)) {
                dates.push(dateStr);
                count++;
            }
        } else {
            dates.push(dateStr);
            count++;
        }
        
        // Move to next occurrence
        switch (recurrence.type) {
            case 'daily':
                current.setDate(current.getDate() + recurrence.interval);
                break;
            case 'weekly':
                if (recurrence.weekdays && recurrence.weekdays.length > 0) {
                    // Find next weekday
                    let foundNext = false;
                    for (let i = 1; i <= 7; i++) {
                        const nextDay = new Date(current);
                        nextDay.setDate(current.getDate() + i);
                        if (recurrence.weekdays.includes(nextDay.getDay())) {
                            current = nextDay;
                            foundNext = true;
                            break;
                        }
                    }
                    if (!foundNext) {
                        // If no next weekday found in current week, move to next interval
                        current.setDate(current.getDate() + (7 * recurrence.interval));
                        // Reset to first weekday of the new week
                        while (!recurrence.weekdays.includes(current.getDay())) {
                            current.setDate(current.getDate() + 1);
                        }
                    }
                } else {
                    current.setDate(current.getDate() + (7 * recurrence.interval));
                }
                break;
            case 'monthly':
                current.setMonth(current.getMonth() + recurrence.interval);
                break;
            case 'yearly':
                current.setFullYear(current.getFullYear() + recurrence.interval);
                break;
            default:
                return dates;
        }
    }
    
    return dates;
};

/**
 * Create recurring task instances from a parent task
 */
export const createRecurringTaskInstances = (
    parentTask: Task, 
    dates: string[]
): Omit<Task, '_id' | 'createdAt' | 'updatedAt'>[] => {
    return dates.map((date, index) => ({
        title: parentTask.title,
        description: parentTask.description,
        date,
        order: parentTask.order,
        priority: parentTask.priority,
        completed: false,
        parentTaskId: parentTask._id,
        isRecurring: true,
        recurrence: index === 0 ? parentTask.recurrence : undefined, // Only first instance keeps recurrence rule
    }));
};

/**
 * Get human-readable recurrence description
 */
export const getRecurrenceDescription = (recurrence: RecurrenceRule): string => {
    if (recurrence.type === 'none') return 'Does not repeat';
    
    const interval = recurrence.interval;
    const intervalText = interval === 1 ? '' : `every ${interval} `;
    
    switch (recurrence.type) {
        case 'daily':
            return `Repeats ${intervalText}day${interval > 1 ? 's' : ''}`;
        case 'weekly':
            if (recurrence.weekdays && recurrence.weekdays.length > 0) {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const selectedDays = recurrence.weekdays.map(day => dayNames[day]).join(', ');
                return `Repeats ${intervalText}week${interval > 1 ? 's' : ''} on ${selectedDays}`;
            }
            return `Repeats ${intervalText}week${interval > 1 ? 's' : ''}`;
        case 'monthly':
            return `Repeats ${intervalText}month${interval > 1 ? 's' : ''}`;
        case 'yearly':
            return `Repeats ${intervalText}year${interval > 1 ? 's' : ''}`;
        default:
            return 'Custom recurrence';
    }
};

/**
 * Check if a task should generate new instances for the current view period
 */
export const shouldGenerateRecurringInstances = (
    task: Task,
    viewStartDate: Date,
    viewEndDate: Date
): boolean => {
    if (!task.recurrence || task.recurrence.type === 'none' || task.parentTaskId) {
        return false;
    }
    
    const taskDate = new Date(task.date);
    
    // Check if task's recurrence period overlaps with view period
    const endDate = task.recurrence.endDate ? new Date(task.recurrence.endDate) : null;
    
    // Task should be in or before the view period
    if (taskDate > viewEndDate) return false;
    
    // If task has end date, it should be in or after the view period
    if (endDate && endDate < viewStartDate) return false;
    
    return true;
}; 