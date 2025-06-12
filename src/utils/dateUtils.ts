import { CalendarDay, Task, Holiday } from '../types';

// Format date utility
export const format = (date: Date, formatStr: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const shortMonthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    switch (formatStr) {
        case 'yyyy-MM-dd':
            return `${year}-${month}-${day}`;
        case 'MMMM yyyy':
            return `${monthNames[date.getMonth()]} ${year}`;
        case 'MMMM':
            return monthNames[date.getMonth()];
        case 'MMMM d, yyyy':
            return `${monthNames[date.getMonth()]} ${date.getDate()}, ${year}`;
        case 'MMM d, yyyy':
            return `${shortMonthNames[date.getMonth()]} ${date.getDate()}, ${year}`;
        default:
            return date.toString();
    }
};

// Check if date is today
const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

// Check if date is weekend (Saturday and Sunday)
const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

// Check if dates are in same month
const isSameMonth = (date: Date, compareDate: Date): boolean => {
    return date.getMonth() === compareDate.getMonth() &&
        date.getFullYear() === compareDate.getFullYear();
};

// Get calendar days for a month with padding days from previous/next month
export const getCalendarDays = (year: number, month: number, startWeekOnMonday: boolean = true): Date[] => {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    // Get the first day to display
    const startDate = new Date(firstDayOfMonth);
    if (startWeekOnMonday) {
        // Start from Monday
        const day = firstDayOfMonth.getDay();
        const daysFromMonday = day === 0 ? 6 : day - 1;
        startDate.setDate(startDate.getDate() - daysFromMonday);
    } else {
        // Start from Sunday (original logic)
        startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    }

    // Get the last day to display
    const endDate = new Date(lastDayOfMonth);
    if (startWeekOnMonday) {
        // End on Sunday
        const day = lastDayOfMonth.getDay();
        const daysToAdd = day === 0 ? 0 : 7 - day;
        endDate.setDate(endDate.getDate() + daysToAdd);
    } else {
        // End on Saturday (original logic)
        const daysToAdd = 6 - lastDayOfMonth.getDay();
        endDate.setDate(endDate.getDate() + daysToAdd);
    }

    const days: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
};

// Create calendar day object
export const createCalendarDay = (
    date: Date,
    currentMonth: Date,
    tasks: Task[],
    holidays: Holiday[]
): CalendarDay => {
    const dateStr = format(date, 'yyyy-MM-dd');

    return {
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isToday(date),
        isWeekend: isWeekend(date),
        tasks: tasks
            .filter(task => {
                // Handle both date formats: "2025-06-09" and "2025-06-09T00:00:00.000Z"
                const taskDateStr = task.date.split('T')[0];
                return taskDateStr === dateStr;
            })
            .sort((a, b) => a.order - b.order),
        holidays: holidays.filter(holiday => holiday.date === dateStr),
    };
};

// Format date for display
export const formatDate = (date: Date, formatStr: string = 'MMMM yyyy'): string => {
    return format(date, formatStr);
};

// Get month name
export const getMonthName = (month: number): string => {
    const date = new Date(2024, month - 1, 1);
    return format(date, 'MMMM');
};

// Get weekday names
export const getWeekdayNames = (short: boolean = false, startWeekOnMonday: boolean = true): string[] => {
    const weekdaysFromMonday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekdaysFromSunday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const weekdays = startWeekOnMonday ? weekdaysFromMonday : weekdaysFromSunday;
    return short ? weekdays.map(day => day.slice(0, 3)) : weekdays;
};

// Get calendar days for a week
export const getWeekDays = (date: Date, startWeekOnMonday: boolean = true): Date[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    
    if (startWeekOnMonday) {
        // Set to Monday of this week (0 = Sunday, 1 = Monday, etc.)
        const daysFromMonday = day === 0 ? 6 : day - 1;
        startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);
    } else {
        // Set to Sunday of this week
        startOfWeek.setDate(startOfWeek.getDate() - day);
    }
    
    const days: Date[] = [];
    
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        days.push(currentDay);
    }
    
    return days;
};

// Get start and end of week (starting from Monday)
export const getWeekRange = (date: Date): { start: Date; end: Date } => {
    const start = new Date(date);
    const day = start.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - daysFromMonday);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return { start, end };
};

// Format week range for display
export const formatWeekRange = (date: Date): string => {
    const { start, end } = getWeekRange(date);
    
    if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMMM')} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    } else {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
};