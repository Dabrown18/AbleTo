import { useFocusEffect } from '@react-navigation/native';
import React, { useRef } from 'react';
import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from 'react-query';

type Callback<T> = QueryFunction<T, QueryKey>;
type Options<T> = Omit<UseQueryOptions<T, unknown, T, QueryKey>, 'queryKey' | 'queryFn'>;

/*
 * useFocusRefetchQuery integrates the useFocusEffect hook on top of React Query
 * in order to allow us to automatically refetch data on screen focus
 */
const useFocusRefetchQuery = <T>(queryKey: QueryKey, callback: Callback<T>, options?: Options<T>) => {
    const firstTimeRef = useRef(true);
    const { refetch, ...rest } = useQuery(queryKey, callback, options);

    useFocusEffect(
        React.useCallback(() => {
            // This prevents the refetch on initial component mount
            if (firstTimeRef.current) {
                firstTimeRef.current = false;
                return;
            }

            refetch();
        }, [refetch])
    );

    return { refetch, ...rest };
};

export default useFocusRefetchQuery;
