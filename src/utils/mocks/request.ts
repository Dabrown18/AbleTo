import { DefaultBodyType, PathParams, ResponseResolver, rest, RestContext, RestRequest } from 'msw';
import { API_URL } from 'react-native-dotenv';

import server from './server';

export type Resolver = ResponseResolver<RestRequest<DefaultBodyType, PathParams>, RestContext, any>;

// Activities

export const mockGetLastCompletedActivity = (resolver: Resolver) =>
    server.use(rest.get(`${API_URL}/user_activities/last_complete`, resolver));

export const mockFetchActivityConfig = (resolver: Resolver, activitySlug: string) =>
    server.use(rest.get(`${API_URL}/activity_configs/${activitySlug}`, resolver));

export const mockSaveUserActivity = (resolver: Resolver, id: number) =>
    server.use(rest.put(`${API_URL}/user_activities/${id}`, resolver));

// Favorites

export const mockFetchFavorites = (resolver: Resolver) => server.use(rest.get(`${API_URL}/favorites`, resolver));

// Habits

export const mockFetchHabits = (resolver: Resolver) => server.use(rest.get(`${API_URL}/health_habits`, resolver));
