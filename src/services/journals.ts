import { fetchCompleteActivitiesBySlug } from './activities';

/**
 * Fetches freewrite journal entries for the current user from the `user_activities` table
 * @returns Sorted (from newest to oldest) user's entries or `null` if the user doesn't have any entries
 */
export const fetchFreewriteJournalActivities = async () => {
    const freewriteJournalActivities = await fetchCompleteActivitiesBySlug('freewrite_journal');

    if (!freewriteJournalActivities) return [];

    // We're going in reversed order so they are sorted from newest to oldest.
    freewriteJournalActivities.reverse();

    return freewriteJournalActivities;
};
