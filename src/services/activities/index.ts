import request from '../request';
import queryClient from '@src/config/queryClient';
import { ActivityConfig, PersistedUserActivity } from '@src/services/activities/types';

export type FetchConfigArgs = {
    activitySlug: string;
    userActivityId?: number;
    programActivityId?: string;
    userId?: number;
};

export const fetchActivityConfig = async ({
    activitySlug,
    programActivityId,
    userId,
}: FetchConfigArgs): Promise<ActivityConfig> =>
    await queryClient.fetchQuery(['fetchActivityConfig', { activitySlug, programActivityId, userId }], async () => {
        try {
            const { data } = await request.get(`/activity_configs/${activitySlug}`, {
                params: {
                    program_activity_id: programActivityId,
                    user_id: userId,
                },
            });

            return data?.activity_config;
        } catch (error) {
            throw new Error('Failed to fetch Activity Configuration');
        }
    });
/**
 * Fetch the latest uncompleted User Activity for the provided slug
 * If one does not exist, create one with the provided slug & program_activity_id
 * If user_activity_id is passed then we edit existing activity in case it's editable
 */
export const fetchOrCreateActivity = async ({
    activity_slug,
    program_activity_id,
    user_activity_id,
    schema_version = 1,
}: CreateUserActivityArgs): Promise<PersistedUserActivity> => {
    try {
        let activity: PersistedUserActivity;
        if (user_activity_id !== undefined) {
            activity = await getUserActivityById(user_activity_id);
        } else {
            activity = await fetchLatestActivityBySlug(activity_slug);
        }
        return activity;
    } catch (error) {
        if (error.response.status === 404) {
            const activity = await createUserActivity({
                activity_slug,
                program_activity_id,
                user_activity_id,
                schema_version,
            });
            return activity;
        }

        throw new Error('Failed to get or create activity');
    }
};

export const fetchLatestActivityBySlug = async (activity_slug: string) =>
    await queryClient.fetchQuery(['latestActivityBySlug', activity_slug], async () => {
        const { data } = await request.get(`/user_activities/latest`, { params: { activity_slug } });
        return data?.user_activity;
    });

/**
 * Fetches all completed activities with the passed slug
 * @returns completed activities or `null` if the user has no completed activities
 */
export const fetchCompleteActivitiesBySlug = async (activity_slug: string): Promise<PersistedUserActivity[] | null> => {
    try {
        const { data } = await request.get('/user_activities/all_complete', { params: { activity_slug } });
        return data?.user_activities;
        // We can assume we don't have a completed activity with the given slug
    } catch {
        return null;
    }
};

export const getUserActivityById = async (user_activity_id: number) =>
    await queryClient.fetchQuery(['userActivityById', user_activity_id], async () => {
        const { data } = await request.get(`/user_activities/${user_activity_id}`);
        return data?.user_activity;
    });

type CreateUserActivityArgs = {
    activity_slug: string;
    program_activity_id: string;
    user_activity_id?: number;
    schema_version?: number;
};

export const createUserActivity = async ({
    activity_slug,
    program_activity_id,
    user_activity_id,
    schema_version = 1,
}: CreateUserActivityArgs): Promise<PersistedUserActivity> => {
    const { data } = await request.post('user_activities', {
        user_activity: { activity_slug, program_activity_id, user_activity_id, schema_version },
    });

    // Cache newly created activities
    queryClient.setQueryData<PersistedUserActivity>(['latestActivityBySlug', activity_slug], data?.user_activity);

    return data?.user_activity;
};

export const saveUserActivity = async ({
    id,
    activity_slug,
    last_step_completed,
    program_activity_id,
    started_at,
    completed_at,
    completion_content,
    content,
    schema_version = 1,
    state = 'completed',
    deleted,
}: PersistedUserActivity) => {
    try {
        const user_activity = {
            activity_slug,
            completed_at,
            completion_content,
            content,
            id,
            last_step_completed,
            program_activity_id,
            schema_version,
            started_at,
            state,
            deleted,
        };

        if (completed_at) {
            // We've completed a new activity, so we clear out
            // the latest unfinished activity cache
            queryClient.invalidateQueries(['latestActivityBySlug', activity_slug]);

            // We also cache the newly completed activity as the 'lastCompleted' one
            queryClient.setQueryData<PersistedUserActivity>(['lastCompletedActivity', activity_slug], user_activity);
        }

        await request.put(`/user_activities/${id}`, { user_activity });
    } catch (error) {
        throw new Error('Failed to save Activity');
    }
};

export const getLastCompletedActivity = async (activitySlug: string): Promise<PersistedUserActivity | null> =>
    await queryClient.fetchQuery(['lastCompletedActivity', activitySlug], async () => {
        try {
            const { data } = await request.get('/user_activities/last_complete', {
                params: { activity_slug: activitySlug },
            });

            return data.user_activity;
        } catch (error) {
            // We can assume we don't have a last completed activity
            return null;
        }
    });
