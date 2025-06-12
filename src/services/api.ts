import axios from 'axios';
import { Task, Holiday, AnalyticsData } from '../types';

const API_BASE_URL = 'https://calender-backend-production-71cf.up.railway.app/api';
const HOLIDAY_API_BASE_URL = 'https://date.nager.at/api/v3';

// Create axios instance for our backend
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Task API methods
export const taskApi = {
    // Get tasks for a specific month
    getTasksByMonth: async (year: number, month: number): Promise<Task[]> => {
        const response = await apiClient.get('/tasks', {
            params: { year, month },
        });
        return response.data;
    },

    // Create a new task
    createTask: async (task: Partial<Task>): Promise<Task> => {
        const response = await apiClient.post('/tasks', task);
        return response.data;
    },

    // Update a task
    updateTask: async (id: string, task: Partial<Task>): Promise<Task> => {
        const response = await apiClient.put(`/tasks/${id}`, task);
        return response.data;
    },

    // Delete a task
    deleteTask: async (id: string): Promise<void> => {
        await apiClient.delete(`/tasks/${id}`);
    },

    // Reorder tasks
    reorderTasks: async (tasks: { id: string; order: number; date: string }[]): Promise<Task[]> => {
        const response = await apiClient.put('/tasks/reorder', { tasks });
        return response.data;
    },

    // Generate recurring task instances
    generateRecurringInstances: async (taskId: string, startDate: string, endDate: string): Promise<Task[]> => {
        const response = await apiClient.post(`/tasks/${taskId}/generate-recurring`, {
            startDate,
            endDate,
        });
        return response.data;
    },

    // Update recurring task series
    updateRecurringSeries: async (taskId: string, task: Partial<Task>, updateMode: 'this' | 'future' | 'all'): Promise<Task[]> => {
        const response = await apiClient.put(`/tasks/${taskId}/recurring`, {
            task,
            updateMode,
        });
        return response.data;
    },

    // Delete recurring task series
    deleteRecurringSeries: async (taskId: string, deleteMode: 'this' | 'future' | 'all'): Promise<void> => {
        await apiClient.delete(`/tasks/${taskId}/recurring`, {
            data: { deleteMode },
        });
    },
};

// Holiday API methods
export const holidayApi = {
    // Get holidays for a specific year and country
    getHolidays: async (year: number, countryCode: string = 'UA'): Promise<Holiday[]> => {
        try {
            const response = await axios.get(
                `${HOLIDAY_API_BASE_URL}/PublicHolidays/${year}/${countryCode}`
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch holidays:', error);
            return [];
        }
    },

    // Get available countries
    getAvailableCountries: async () => {
        try {
            const response = await axios.get(
                `${HOLIDAY_API_BASE_URL}/AvailableCountries`
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch countries:', error);
            return [];
        }
    },
};

// Analytics API methods
export const analyticsApi = {
    // Get comprehensive analytics data
    getAnalytics: async (days: number = 30): Promise<AnalyticsData> => {
        const response = await apiClient.get('/analytics', {
            params: { days },
        });
        return response.data;
    },

    // Get task completion trends
    getCompletionTrends: async (period: string = 'daily', days: number = 30): Promise<any[]> => {
        const response = await apiClient.get('/analytics/trends', {
            params: { period, days },
        });
        return response.data;
    },
};