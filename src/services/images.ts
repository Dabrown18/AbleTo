// We're not fetching the images from the API
// but from the web instead, so we're opting out
// of our request instance, configured with the API
// as a baseURL
import axios from 'axios';

import Logger from './logger';

export const fetchImages = async (baseUrl: string) => {
    try {
        const { data } = await axios.get(`${baseUrl}/web-resources.json`);
        return data.images.models;
    } catch (error) {
        if (error.message === 'Network Error') return;
        Logger.error(error, 'Failed to fetch images');
    }
};
