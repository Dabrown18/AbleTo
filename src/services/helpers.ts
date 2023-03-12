import { addDays, differenceInCalendarDays, differenceInSeconds, format, startOfDay } from 'date-fns';
import snakeCase from 'lodash.snakecase';
import { Linking, StatusBar } from 'react-native';
import { isEmulator } from 'react-native-device-info';
import { ENVIRONMENT } from 'react-native-dotenv';

import { Doorman } from './doorman';
import { getCustomFirebaseToken } from './tokens';
import { MoodRatingEntry } from '@src/activities/templates/MoodLog/types';
import { SUPPORTED_ACTIVITIES } from '@src/constants/activities';
import { MOOD_RATINGS } from '@src/core/MoodPicker/utils';

const MILLISECONDS_IN_DAY = 86400000; // 1000 * 60 * 60 * 24;

export const isDebug = __DEV__;

/**
 * Check if the app has been built with the local environment set as default,
 * meaning that this is a development build
 */

export const isDevBuild = ENVIRONMENT === 'development';

export const isProdBuild = ENVIRONMENT === 'production';

export const isStagingBuild = !isDevBuild && !isProdBuild;

export const isDeviceEmulated = () => isEmulator();

export const capitalize = (str: string) => str.split('').map((s) => s.toUpperCase());

export const formatDateToString = (date: Date) => format(date, 'yyyy-MM-dd');

export const getStatusBarHeight = () => StatusBar.currentHeight;

export const openLink = async (link?: string, requiresAuthentication?: boolean) => {
    try {
        if (!link) return;

        const isUrlOpenable = await Linking.canOpenURL(link);

        if (isUrlOpenable) {
            if (requiresAuthentication) {
                const { custom_firebase_token } = await getCustomFirebaseToken();

                Linking.openURL(link.concat(`?idp_custom_token=${custom_firebase_token.token}`));
            } else {
                Linking.openURL(link);
            }
        } else {
            const isMailLink = link.includes('mailto');

            Doorman.unableToOpenUrlEvent(isMailLink);
        }
    } catch (error) {
        console.error('Failed to open link', error);
    }
};

export const getUrlParams = (url: string) => {
    if (!url) return {};

    const rawParams = url.match(/(\?|&)([^=]+)=([^&]+)/gi);
    if (!rawParams) return {};

    const params = rawParams.reduce((acc: Record<string, string>, curr) => {
        // Strip off ? and &s, decode forward slashes
        const current = curr.replace(/\?|&/, '').replace(/%2F/, '/');

        const [key, value] = current.split('=');

        acc[key] = value;
        return acc;
    }, {});

    return params;
};

/**
 * Returns true if the activity is supported natively, and false if it is not.
 * It returns true if:
 * 1. We have an activity in SUPPORTED_ACTIVITIES with slug equal to activitySlug, that doesn't have programActivityIds
 * or
 * 2. We have an activity in SUPPORTED_ACTIVITIES with slug equal to activitySlug, which also has programActivityIds array
 * that includes programActivityId
 */
export const isActivitySupported = (activitySlug: string, programActivityId?: string) => {
    const isSlugSupported = SUPPORTED_ACTIVITIES.find((supportedActivity) => {
        return supportedActivity.slug === activitySlug;
    });

    if (!isSlugSupported) return false;

    if (!isSlugSupported.programActivityIds) return true;

    if (programActivityId && isSlugSupported.programActivityIds.includes(programActivityId)) return true;

    return false;
};

export const getPoints = (activityData: MoodRatingEntry[], endDate: Date) => {
    return activityData.map((point) => {
        const dayStart = startOfDay(new Date(point.when_felt));
        const dayIndex = differenceInCalendarDays(dayStart, endDate);
        const positionInDay = (differenceInSeconds(new Date(point.when_felt), dayStart) * 1000) / MILLISECONDS_IN_DAY;
        const color = MOOD_RATINGS.find((r) => r.valueInt === point.value)?.color;

        return {
            ...point,

            // divided by the number of columns and multiplied with 100 to get value in percent
            x: ((dayIndex + positionInDay) / 7) * 100,

            // divided by the number of mood ratings and multiplied with 100 to get value in percent
            y: ((point.value * -1 + 7 + 0.5) / 7) * 100,
            color,
        };
    });
};

export const getCurrentWeekDays = (startDay: Date) => {
    const days = [];

    for (let i = 0; i <= 6; i++) {
        days.push(addDays(startDay, i));
    }

    return days;
};

export const formatTime = (value: number) => format(new Date(value * 1000), 'mm:ss');

/**
 * Sorts (non-mutating) an array of objects by a prop value that holds a date.
 * @param array The array that will be sorted.
 * @param dateProp The title of the property that holds the date value.
 * @param asc Whether the array should be sorted by ASC or DESC order. Defaults to 'true'.
 * @returns A sorted copy of the array.
 */
export const sortByDate = (array: any[], dateProp: string, asc = true): any[] => {
    if (asc) return [...array].sort((a, b) => (new Date(a[dateProp]) as any) - (new Date(b[dateProp]) as any)); // ASC
    return [...array].sort((a, b) => (new Date(b[dateProp]) as any) - (new Date(a[dateProp]) as any)); // DESC
};

export const capitalizeWord = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export const toSnakeCase = (string: string) => snakeCase(string);

/**
 * TypeScript's return type of `Object.keys` is always
 * an array of strings even if we know the object keys' type.
 * This helper eliminates this type checking error.
 */
export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const isObjectEmpty = (object: object) => {
    return Object.keys(object).length === 0;
};

export const toISOStringWithoutMilliseconds = (date: Date) => {
    return date.toISOString().replace(/\.\d+/, '');
};
