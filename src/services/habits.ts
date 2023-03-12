import { useQuery } from 'react-query';

import { formatDateToString } from './helpers';
import Logger from './logger';
import request from './request';
import queryClient from '@src/config/queryClient';

export type IconName =
    | 'alcohol'
    | 'caffeine'
    | 'cannabis'
    | 'custom'
    | 'eating'
    | 'exercise'
    | 'family'
    | 'friends'
    | 'hobbies'
    | 'hygiene'
    | 'medication'
    | 'meditation'
    | 'nicotine'
    | 'outdoors'
    | 'pets'
    | 'relationship'
    | 'sleep'
    | 'water';

export type Habit = {
    actual: number | null;
    default_habit: boolean;
    description: string;
    entry_date: string;
    goal: number;
    habit_type: string;
    health_habit_id: number;
    icon_name: IconName;
    is_positive: boolean;
    note: string | null;
    status: string;
    title: string;
    unit: string;
    user_id: number;
};

export type NewHabit = {
    title: string;
    description: string;
    icon_name: IconName;
    habit_type: string;
    default_habit: boolean;
    unit: string;
    goal: number;
    is_positive: boolean;
};

export type DefaultHabitUnit = {
    pluralLabel: string;
    singularLabel: string;
    defaultGoal: number;
    step: number;
    maxValue: number;
};

type DefaultHabitScale = {
    label: string;
    value: boolean;
};

export type DefaultHabit = {
    title?: string;
    units: DefaultHabitUnit[];
    descriptionHelper?: string;
    label?: string;
    habit_type: string;
    icon_name: IconName;
    is_positive?: boolean;
    scale: DefaultHabitScale[];
};

const HABITS_QUERY_KEY = 'healthHabits';
export const HABIT_PROGRESS_SAVE_ERROR = 'Failed to save habit progress';

export const fetchHabits = async (dateToFetchFor: Date): Promise<Habit[]> => {
    const formattedDate = formatDateToString(dateToFetchFor);

    return await queryClient.fetchQuery([HABITS_QUERY_KEY, formattedDate], async () => {
        try {
            const { data } = await request.get(`/health_habits?date=${formattedDate}`);
            return data.health_habits;
        } catch (error) {
            Logger.error(error, 'Failed to fetch habits');
        }
    });
};

export const useGetHabits = (dateToFetchFor: Date) => {
    return useQuery([HABITS_QUERY_KEY, formatDateToString(dateToFetchFor)], () => fetchHabits(dateToFetchFor));
};

export const addHabit = async (habit: NewHabit) => {
    try {
        await request.post(`/health_habits`, {
            health_habit: { ...habit },
        });
        queryClient.refetchQueries([HABITS_QUERY_KEY, formatDateToString(new Date())]);
    } catch (error) {
        Logger.error(error, 'Failed to add habit');
        throw new error();
    }
};

export const editHabit = async (habit: Habit, description: string, goal: number, goalUnit: string, todayDate: Date) => {
    try {
        const updatedHabit = {
            ...habit,
            description,
            goal: goal,
            unit: goalUnit,
        };

        await request.put(`health_habits/${habit.health_habit_id}`, {
            health_habit: updatedHabit,
        });
        updateCachedHabit(habit, updatedHabit, formatDateToString(todayDate));
    } catch (error) {
        Logger.error(error, 'Failed to edit habit');
        throw new error();
    }
};

export const updateCachedHabit = (habitToUpdate: Habit, updatedHabit: Habit, formattedDate: string) => {
    const habits = queryClient.getQueryData<Habit[]>([HABITS_QUERY_KEY, formattedDate]);

    if (!habits) return;

    const habitToUpdateIndex = habits.findIndex((el) => {
        return el.health_habit_id === habitToUpdate.health_habit_id && el.entry_date === formattedDate;
    });

    const habitsCopy = [...habits];

    habitsCopy.splice(habitToUpdateIndex, 1, updatedHabit);

    queryClient.setQueryData<Habit[]>([HABITS_QUERY_KEY, formattedDate], [...habitsCopy]);
};

export const addProgress = async (habit: Habit, progress: number, note: string, habitsFetchedForDate: Date) => {
    try {
        await request.post('health_habit_snapshots', {
            snapshot: {
                health_habit_id: habit.health_habit_id,
                actual: progress,
                note,
                achieved_at: habit.entry_date,
            },
        });
        updateCachedHabitProgress(habit.health_habit_id, progress, note, formatDateToString(habitsFetchedForDate));
    } catch (error) {
        Logger.error(error, HABIT_PROGRESS_SAVE_ERROR);
        throw new Error(HABIT_PROGRESS_SAVE_ERROR); // Rethrow error
    }
};

export const deleteHabit = async (habit: Habit, fetchedForDate: Date) => {
    try {
        await request.put(`health_habits/${habit.health_habit_id}`, {
            health_habit: {
                status: 'disabled',
            },
        });
        deleteCachedHabit(habit.health_habit_id, formatDateToString(fetchedForDate));
    } catch (error) {
        Logger.error(error, 'Failed to delete habit');
    }
};

const updateCachedHabitProgress = (healthHabitId: number, progress: number, note: string, formattedDate: string) => {
    const habits = queryClient.getQueryData<Habit[]>([HABITS_QUERY_KEY, formattedDate]);
    if (!habits) return;

    const updatedHabit = habits?.find((h) => h.health_habit_id === healthHabitId);
    if (updatedHabit) {
        updatedHabit.actual = progress;
        updatedHabit.note = note;
    }
    queryClient.setQueryData<Habit[]>([HABITS_QUERY_KEY, formattedDate], [...habits]);
};

export const deleteCachedHabit = (healthHabitId: number, formattedDate: string) => {
    const habits = queryClient.getQueryData<Habit[]>([HABITS_QUERY_KEY, formattedDate]);
    if (!habits) return;

    const updatedHabits = habits.filter((el) => el.health_habit_id !== healthHabitId);

    queryClient.setQueryData<Habit[]>([HABITS_QUERY_KEY, formattedDate], [...updatedHabits]);
};

export const getDefaultHabits = (habits: DefaultHabit[]) => habits.filter((h) => h.habit_type !== 'custom_habit');
