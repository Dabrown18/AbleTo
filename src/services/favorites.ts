import { useQuery } from 'react-query';
import { Updater } from 'react-query/types/core/utils';

import request from './request';
import queryClient from '@src/config/queryClient';
import Logger from '@src/services/logger';

export const UserActivityType = 'UserActivity';

// Currently as only "UserActivity" type is supported both slug
// and program_activity_id will be required.
// The Favorited type will expand to support more "types" in future.
export type Favorited = {
    slug: string;
    type: 'UserActivity';
    program_activity_id: string;
};

export type Favorite = {
    id: number;
    user_id: number;
    favorited: Favorited;
};

const FAVORITES_URL = '/favorites';

export const fetchFavorites = async (): Promise<Favorite[] | null> => {
    try {
        const { data } = await request.get(FAVORITES_URL);
        return data.favorites;
    } catch (error) {
        Logger.error(error, 'Failed to fetch favorites');
        return null;
    }
};

export const useGetFavorites = () => {
    return useQuery(['fetchFavorites'], fetchFavorites);
};

const updateFavoritesQuery = (callback: Updater<Favorite[] | undefined, Favorite[]>) => {
    queryClient.setQueryData<Favorite[]>(['fetchFavorites'], callback);
};

export const saveFavorite = async (favorited: Favorited) => {
    try {
        const { data } = await request.post(FAVORITES_URL, { favorite: { favorited } });
        const { favorite } = data;

        updateFavoritesQuery((favorites) => {
            if (!favorites?.length) return [favorite];

            const persistedFavorite = favorites?.find((favoriteItem) => favoriteItem.id === favorite.id);
            if (!persistedFavorite) return [...favorites, favorite];

            return favorites;
        });
    } catch (error) {
        Logger.error(error, 'Failed to save favorite');
    }
};

export const deleteFavorite = async (id: number, userId: number) => {
    try {
        await request.delete(`${FAVORITES_URL}/${id}`, { params: { user_id: userId } });

        updateFavoritesQuery((favorites) => favorites?.filter((favoriteItem) => favoriteItem.id !== id) || []);
    } catch (error) {
        Logger.error(error, 'Failed to delete favorite');
    }
};
