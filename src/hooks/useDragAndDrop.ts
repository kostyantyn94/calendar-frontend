import { useState, useCallback, DragEvent } from 'react';
import { Task } from '../types';

interface DragState {
    isDragging: boolean;
    draggedTask: Task | null;
    sourceDate: string | null;
    sourceIndex: number | null;
}

export const useDragAndDrop = (onReorder: (updates: any[]) => void) => {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedTask: null,
        sourceDate: null,
        sourceIndex: null,
    });

    // Handle drag start
    const handleDragStart = useCallback((
        e: DragEvent<HTMLDivElement>,
        task: Task,
        sourceDate: string,
        sourceIndex: number
    ) => {
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task._id);

        // Set drag state
        setDragState({
            isDragging: true,
            draggedTask: task,
            sourceDate,
            sourceIndex,
        });

        // Add dragging class to element
        const element = e.target as HTMLElement;
        element.style.opacity = '0.5';
    }, []);

    // Handle drag end
    const handleDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
        // Reset opacity
        const element = e.target as HTMLElement;
        element.style.opacity = '1';

        // Reset drag state
        setDragState({
            isDragging: false,
            draggedTask: null,
            sourceDate: null,
            sourceIndex: null,
        });
    }, []);

    // Handle drag over
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    // Handle drop
    const handleDrop = useCallback((
        e: DragEvent<HTMLDivElement>,
        targetDate: string,
        targetTasks: Task[],
        targetIndex?: number
    ) => {
        e.preventDefault();

        const { draggedTask, sourceDate } = dragState;

        if (!draggedTask || !sourceDate) return;

        const updates: any[] = [];

        if (sourceDate === targetDate) {
            // Reordering within the same date
            const filteredTasks = targetTasks.filter(t => t._id !== draggedTask._id);
            const newIndex = targetIndex !== undefined ? Math.min(targetIndex, filteredTasks.length) : filteredTasks.length;
            
            // Prevent dropping on the same position
            const currentIndex = targetTasks.findIndex(t => t._id === draggedTask._id);
            
            // More precise same position check
            if (currentIndex === newIndex) {
                return;
            }
            
            // If we're just moving one position down (from currentIndex to currentIndex+1)
            // and there are other tasks after current position
            if (newIndex === currentIndex + 1 && currentIndex < filteredTasks.length - 1) {
                return;
            }
            
            // Create ordered list with dragged task inserted at new position
            const reorderedTasks = [
                ...filteredTasks.slice(0, newIndex),
                draggedTask,
                ...filteredTasks.slice(newIndex)
            ];

            // Create updates for all tasks with new order
            reorderedTasks.forEach((task, index) => {
                updates.push({
                    id: task._id,
                    order: index,
                    date: targetDate,
                });
            });
        } else {
            // Moving to a different date
            const newIndex = targetIndex !== undefined ? Math.min(targetIndex, targetTasks.length) : targetTasks.length;
            
            // Update the dragged task to new date and position
            updates.push({
                id: draggedTask._id,
                order: newIndex,
                date: targetDate,
            });

            // Update orders for existing tasks in target date (shift them down)
            targetTasks.forEach((task, index) => {
                if (index >= newIndex) {
                    updates.push({
                        id: task._id,
                        order: index + 1,
                        date: targetDate,
                    });
                }
            });
        }

        if (updates.length > 0) {
            onReorder(updates);
        }
    }, [dragState, onReorder]);

    return {
        dragState,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
    };
};