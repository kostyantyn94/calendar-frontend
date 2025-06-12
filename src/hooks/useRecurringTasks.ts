import { useMemo } from 'react';
import { Task } from '../types';
import { 
    generateRecurringDates, 
    createRecurringTaskInstances, 
    shouldGenerateRecurringInstances 
} from '../utils/recurrenceUtils';

export const useRecurringTasks = (
    tasks: Task[], 
    viewStartDate: Date, 
    viewEndDate: Date
) => {
    const expandedTasks = useMemo(() => {
        const result: Task[] = [];
        const existingTaskDates = new Set<string>();
        
        // First pass: collect existing tasks and their dates
        tasks.forEach(task => {
            result.push(task);
            existingTaskDates.add(`${task.parentTaskId || task._id}-${task.date}`);
        });
        
        // Second pass: generate recurring instances for parent tasks
        tasks.forEach(task => {
            if (shouldGenerateRecurringInstances(task, viewStartDate, viewEndDate) && task.recurrence) {
                const recurringDates = generateRecurringDates(
                    task.date, 
                    task.recurrence, 
                    Math.ceil((viewEndDate.getTime() - viewStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 30 // Add buffer
                );
                
                // Create instances for dates that don't already exist
                const newInstances = createRecurringTaskInstances(task, recurringDates)
                    .filter(instance => {
                        const instanceDate = new Date(instance.date);
                        const uniqueKey = `${task._id}-${instance.date}`;
                        
                        return instanceDate >= viewStartDate && 
                               instanceDate <= viewEndDate && 
                               !existingTaskDates.has(uniqueKey);
                    })
                    .map((instance, index) => ({
                        ...instance,
                        _id: `${task._id}-recurring-${index}-${Date.now()}`, // Generate temporary ID
                        createdAt: task.createdAt,
                        updatedAt: task.updatedAt,
                    }));
                
                result.push(...newInstances as Task[]);
            }
        });
        
        return result;
    }, [tasks, viewStartDate, viewEndDate]);
    
    return expandedTasks;
}; 