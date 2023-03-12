import { startOfDay } from 'date-fns';
import { useQuery } from 'react-query';

import Logger from './logger';
import request from './request';
import { MoodRatingEntry } from '@src/activities/templates/MoodLog/types';
import queryClient from '@src/config/queryClient';

type MoodRatingResponse = {
    moodRatings: MoodRatingEntry[];
    firstAfterRange: MoodRatingEntry;
    firstBeforeRange: MoodRatingEntry;
};

export const CUSTOM_VALUES_MAX_LENGTH = 5;

export const useFetchMoodRatings = (dateToFetchFor: Date) => {
    return useQuery(['fetchMoodRatings', { dateToFetchFor: dateToFetchFor }], () => fetchMoodRatings(dateToFetchFor));
};

export const fetchMoodRatings = async (dateToFetchFor: Date): Promise<MoodRatingResponse> => {
    try {
        const formattedDate = startOfDay(dateToFetchFor).toISOString();
        const {
            data: { mood_ratings },
        } = await request.get(`/mood_ratings?start_date=${formattedDate}`);
        return mood_ratings;
    } catch (error) {
        Logger.error(error, 'Failed to fetch mood ratings');
        throw error;
    }
};

export const deleteMoodRating = async (moodRatingId: number, dateToFetchFor: Date) => {
    try {
        await request.delete(`/mood_ratings/${moodRatingId}`);

        const cachedMoodRatings = queryClient.getQueryData<MoodRatingResponse>([
            'fetchMoodRatings',
            { dateToFetchFor },
        ]);
        if (!cachedMoodRatings) return;

        queryClient.setQueryData<MoodRatingResponse>(['fetchMoodRatings', { dateToFetchFor }], (moodResponse) => {
            const response = moodResponse!;

            response.moodRatings = response.moodRatings.filter((moodRating) => moodRating.id !== moodRatingId);

            return response;
        });
    } catch (error) {
        Logger.error(error, 'Failed to delete mood rating');
    }
};
