import Logger from './logger';
import request from './request';

export const getFeatureFlags = async (): Promise<Record<string, boolean> | {}> => {
    try {
        const { data } = await request.get('/feature_flags');

        return data.feature_flags;
    } catch (error) {
        Logger.error(error, 'Failed to get feature flags');
        return {};
    }
};
