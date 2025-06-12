// Task priority type
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Recurrence types
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurrenceRule {
    type: RecurrenceType;
    interval: number; // Every N days/weeks/months/years
    endDate?: string; // Optional end date
    count?: number; // Optional max occurrences
    weekdays?: number[]; // For weekly: 0=Sunday, 1=Monday, etc.
}

// Task interface
export interface Task {
    _id: string;
    title: string;
    description?: string;
    date: string;
    order: number;
    priority: TaskPriority;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    // Recurrence fields
    recurrence?: RecurrenceRule;
    parentTaskId?: string; // For recurring task instances
    isRecurring?: boolean;
}

// Holiday interface from Nager.Date API
export interface Holiday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string[] | null;
    launchYear: number | null;
    types: string[];
}

// Calendar day interface
export interface CalendarDay {
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
    tasks: Task[];
    holidays: Holiday[];
}

// Drag and drop types
export interface DragItem {
    task: Task;
    sourceDate: string;
    sourceIndex: number;
}

export interface DropResult {
    targetDate: string;
    targetIndex: number;
}

// Form types
export interface TaskFormData {
    title: string;
    description: string;
    priority: TaskPriority;
    date: string;
    recurrence?: RecurrenceRule;
}

// Calendar view types
export type CalendarView = 'week' | 'month';

// Analytics types
export interface TaskCompletionStats {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    overdueTasks: number;
}

export interface PriorityStats {
    priority: TaskPriority;
    total: number;
    completed: number;
    completionRate: number;
}

export interface DailyStats {
    date: string;
    tasksCreated: number;
    tasksCompleted: number;
    completionRate: number;
}

export interface WeeklyStats {
    week: string;
    tasksCreated: number;
    tasksCompleted: number;
    completionRate: number;
    averageTasksPerDay: number;
}

export interface MonthlyStats {
    month: string;
    tasksCreated: number;
    tasksCompleted: number;
    completionRate: number;
    averageTasksPerDay: number;
}

export interface ProductivityHeatmapData {
    date: string;
    count: number;
    level: number; // 0-4 for different intensity levels
}

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastCompletionDate: string | null;
}

export interface AnalyticsData {
    completionStats: TaskCompletionStats;
    priorityStats: PriorityStats[];
    dailyStats: DailyStats[];
    weeklyStats: WeeklyStats[];
    monthlyStats: MonthlyStats[];
    heatmapData: ProductivityHeatmapData[];
    streakData: StreakData;
    topCategories: { category: string; count: number }[];
    averageTasksPerDay: number;
    productivityScore: number;
}