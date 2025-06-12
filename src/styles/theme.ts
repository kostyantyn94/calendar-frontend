// Импорты должны быть в начале файла
import { lightTheme } from './themes';

// Экспортируем новую систему тем
export * from './themes';

// Сохраняем обратную совместимость - экспортируем светлую тему как theme по умолчанию
export const theme = lightTheme;