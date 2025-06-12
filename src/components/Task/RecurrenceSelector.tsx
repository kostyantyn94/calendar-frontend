import React, { useState } from 'react';
import styled from '@emotion/styled';
import { RecurrenceRule, RecurrenceType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { getRecurrenceDescription } from '../../utils/recurrenceUtils';

interface RecurrenceSelectorProps {
    value: RecurrenceRule;
    onChange: (recurrence: RecurrenceRule) => void;
}

const Container = styled.div<{ theme: any }>`
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
    padding: ${props => props.theme.spacing.md};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.sm};
    background-color: ${props => props.theme.colors.surface};
`;

const Row = styled.div<{ theme: any }>`
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    flex-wrap: wrap;
`;

const Label = styled.label<{ theme: any }>`
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
    min-width: 80px;
`;

const Select = styled.select<{ theme: any }>`
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.sm};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text.primary};
    font-size: 14px;
`;

const Input = styled.input<{ theme: any }>`
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.sm};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text.primary};
    font-size: 14px;
    width: 80px;
`;

const WeekdayContainer = styled.div<{ theme: any }>`
    display: flex;
    gap: ${props => props.theme.spacing.xs};
    flex-wrap: wrap;
`;

const WeekdayButton = styled.button<{ selected: boolean; theme: any }>`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
    background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.background};
    color: ${props => props.selected ? 'white' : props.theme.colors.text.primary};
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
        border-color: ${props => props.theme.colors.primary};
        background-color: ${props => props.selected ? props.theme.colors.primary : `${props.theme.colors.primary}10`};
    }
`;

const Description = styled.div<{ theme: any }>`
    padding: ${props => props.theme.spacing.sm};
    background-color: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.borderRadius.sm};
    font-size: 13px;
    color: ${props => props.theme.colors.text.secondary};
    font-style: italic;
`;

const CheckboxContainer = styled.label<{ theme: any }>`
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.xs};
    cursor: pointer;
    font-size: 14px;
    color: ${props => props.theme.colors.text.primary};
`;

const Checkbox = styled.input`
    margin: 0;
`;

export const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({ value, onChange }) => {
    const { theme } = useTheme();
    const [showAdvanced, setShowAdvanced] = useState(
        Boolean(value.endDate || value.count || (value.type === 'weekly' && value.weekdays))
    );

    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleTypeChange = (type: RecurrenceType) => {
        const newRecurrence: RecurrenceRule = {
            type,
            interval: type === 'none' ? 1 : value.interval || 1,
            ...(type === 'weekly' && { weekdays: value.weekdays || [new Date().getDay()] })
        };
        onChange(newRecurrence);
    };

    const handleIntervalChange = (interval: number) => {
        onChange({ ...value, interval: Math.max(1, interval) });
    };

    const handleWeekdayToggle = (weekday: number) => {
        const currentWeekdays = value.weekdays || [];
        const newWeekdays = currentWeekdays.includes(weekday)
            ? currentWeekdays.filter(d => d !== weekday)
            : [...currentWeekdays, weekday].sort();
        
        if (newWeekdays.length > 0) {
            onChange({ ...value, weekdays: newWeekdays });
        }
    };

    const handleEndDateChange = (endDate: string) => {
        const newRecurrence = { ...value };
        if (endDate) {
            newRecurrence.endDate = endDate;
            delete newRecurrence.count;
        } else {
            delete newRecurrence.endDate;
        }
        onChange(newRecurrence);
    };

    const handleCountChange = (count: number) => {
        const newRecurrence = { ...value };
        if (count > 0) {
            newRecurrence.count = count;
            delete newRecurrence.endDate;
        } else {
            delete newRecurrence.count;
        }
        onChange(newRecurrence);
    };

    return (
        <Container theme={theme}>
            <Row theme={theme}>
                <Label theme={theme}>Repeat:</Label>
                <Select 
                    value={value.type} 
                    onChange={(e) => handleTypeChange(e.target.value as RecurrenceType)}
                    theme={theme}
                >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </Select>
            </Row>

            {value.type !== 'none' && (
                <>
                    <Row theme={theme}>
                        <Label theme={theme}>Every:</Label>
                        <Input
                            type="number"
                            min="1"
                            value={value.interval || 1}
                            onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
                            theme={theme}
                        />
                        <span>{value.type === 'daily' ? 'day(s)' : 
                               value.type === 'weekly' ? 'week(s)' :
                               value.type === 'monthly' ? 'month(s)' : 'year(s)'}</span>
                    </Row>

                    {value.type === 'weekly' && (
                        <Row theme={theme}>
                            <Label theme={theme}>On:</Label>
                            <WeekdayContainer theme={theme}>
                                {weekdays.map((day, index) => (
                                    <WeekdayButton
                                        key={index}
                                        type="button"
                                        selected={value.weekdays?.includes(index) || false}
                                        onClick={() => handleWeekdayToggle(index)}
                                        title={weekdayNames[index]}
                                        theme={theme}
                                    >
                                        {day}
                                    </WeekdayButton>
                                ))}
                            </WeekdayContainer>
                        </Row>
                    )}

                    <CheckboxContainer theme={theme}>
                        <Checkbox
                            type="checkbox"
                            checked={showAdvanced}
                            onChange={(e) => setShowAdvanced(e.target.checked)}
                        />
                        Advanced options
                    </CheckboxContainer>

                    {showAdvanced && (
                        <>
                            <Row theme={theme}>
                                <Label theme={theme}>End date:</Label>
                                <Input
                                    type="date"
                                    value={value.endDate || ''}
                                    onChange={(e) => handleEndDateChange(e.target.value)}
                                    theme={theme}
                                />
                            </Row>

                            <Row theme={theme}>
                                <Label theme={theme}>Or after:</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Count"
                                    value={value.count || ''}
                                    onChange={(e) => handleCountChange(parseInt(e.target.value) || 0)}
                                    theme={theme}
                                />
                                <span>occurrences</span>
                            </Row>
                        </>
                    )}

                    <Description theme={theme}>
                        {getRecurrenceDescription(value)}
                    </Description>
                </>
            )}
        </Container>
    );
}; 