import { version } from '@src/../package.json';
import Axios, { AxiosInstance } from 'axios';
import { MixpanelProperties } from 'mixpanel-react-native';
import { ABLETO_API_URL, PLATFORM_ANALYTICS_KEY } from 'react-native-dotenv';

import { isDevBuild } from '../helpers';
import Logger from '../logger';
import { getCurrentTreatment, UserData } from '../user';
import { getItem, removeItem, setItem } from '@src/services/storage';

export type AnalyticsEvent = {
    event: string;
    properties?: MixpanelProperties; // === { [key: string]: any };
};

type PersistedAnalytics = {
    events: AnalyticsEvent[];
};

const BASE_URL = '/analytics/v1/ux-events';
const BATCH_URL = `${BASE_URL}/batch`;
const BATCH_TIMEOUT = 60000; // 1000 * 60
const PLATFORM_ANALYTICS_STORAGE_KEY = 'PLATFORM_ANALYTICS_STORAGE_KEY';
export const PLATFORM_ANALYTICS_ERROR = 'Failed to send analytics events';
export const PLATFORM_ANALYTICS_ERROR_BACKGROUND = `${PLATFORM_ANALYTICS_ERROR} (background task)`;

let batch: AnalyticsEvent[] = [];
let eventsTimeout: NodeJS.Timeout | null = null;
let superProperties: MixpanelProperties = {};
let isLoading = false;

const request: AxiosInstance = Axios.create({
    baseURL: ABLETO_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'AbleTo-App-Version': isDevBuild ? 'local-development' : version,
        'AbleTo-App-Platform': 'android',
        'AbleTo-API-Key': PLATFORM_ANALYTICS_KEY,
    },
});

const clearBatch = () => (batch = []);

const getPersistedEvents = async (): Promise<AnalyticsEvent[]> => {
    const persistedEvents = await getItem(PLATFORM_ANALYTICS_STORAGE_KEY);
    return persistedEvents ? JSON.parse(persistedEvents).events : [];
};

const persistEvents = async () => {
    const currentPersistedEvents = await getPersistedEvents();
    const events: PersistedAnalytics = { events: [...currentPersistedEvents, ...batch] };
    await setItem(PLATFORM_ANALYTICS_STORAGE_KEY, events);
    clearBatch();
};

const clearPersistedEvents = async () => {
    await removeItem(PLATFORM_ANALYTICS_STORAGE_KEY);
};

const sendEvents = async (shouldPersistEvents?: boolean) => {
    if (isLoading) return;

    const persistedEvents = await getPersistedEvents();
    const events = [...persistedEvents, ...batch];
    eventsTimeout = null;

    if (events.length === 0) return;

    const url = events.length === 1 ? BASE_URL : BATCH_URL;
    const body = events.length === 1 ? JSON.stringify(events[0]) : JSON.stringify(events);

    try {
        isLoading = true;
        await request.post(url, body);
        clearBatch();
        await clearPersistedEvents();
    } catch (error) {
        if (shouldPersistEvents) {
            // Currently we're here only if a potential error occurs when sending
            // the batch from the background task - PlatformAnalyticsService.
            Logger.error(error, PLATFORM_ANALYTICS_ERROR_BACKGROUND);
            return await persistEvents();
        }

        Logger.error(error, PLATFORM_ANALYTICS_ERROR);
        eventsTimeout = setTimeout(async () => await sendEvents(), BATCH_TIMEOUT);
    } finally {
        isLoading = false;
    }
};

const track = (event: string, properties?: MixpanelProperties) => {
    batch.push({ event, properties: { ...superProperties, ...properties, eventTime: new Date().toISOString() } });
    if (eventsTimeout === null) {
        eventsTimeout = setTimeout(async () => await sendEvents(), BATCH_TIMEOUT);
    }
};

const registerSuperProperties = (self: UserData) => {
    const { id, email, program_slug, program_level } = self.user;
    const properties: MixpanelProperties = { id, email, program_slug, program_level };
    const currentTreatment = getCurrentTreatment(self.treatments);
    if (currentTreatment) {
        properties.program = currentTreatment.program;
        properties.productLine = currentTreatment.product_line;
    }
    superProperties = { ...properties };
};

const reset = async () => {
    await sendEvents();
    superProperties = {};
};

const flush = async (shouldPersistEvents?: boolean) => {
    if (eventsTimeout) clearTimeout(eventsTimeout);
    await sendEvents(shouldPersistEvents);
};

const switchBaseURL = (baseURL: string) => (request.defaults.baseURL = baseURL);

export default {
    request,
    switchBaseURL,
    track,
    registerSuperProperties,
    reset,
    flush,
    persistEvents,
};
