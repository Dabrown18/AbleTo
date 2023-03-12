import Logger from './logger';
import request from './request';

/**
 * Sends a GET request to get all flags for the current
 * user from the `flag_sets` table
 */
export const getFlagSet = async () => {
    try {
        const { data } = await request.get('/flag_set');
        return data.flag_set;
    } catch (error) {
        Logger.error(error, 'Failed to get flags set');
    }
};

/**
 * Sends a PUT request to update a flag for the current
 * user in the `flag_sets` table
 */
export const putFlagSet = async (flagToPut: Record<string, boolean>) => {
    try {
        await request.put('/flag_set', { flag_set: flagToPut });
    } catch (error) {
        Logger.error(error, 'Failed to update flag set');
    }
};
