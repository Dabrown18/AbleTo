type SupportedActivities = {
    slug: string;
    programActivityIds?: string[];
};

export const SUPPORTED_ACTIVITIES: SupportedActivities[] = [
    {
        slug: 'mood_tracking_mood_rating',
    },
    {
        slug: 'mood_tracking_mood_log',
    },
    {
        slug: 'habit_tracking',
    },
    {
        slug: 'checking_in',
    },
    {
        slug: 'well_being_index',
    },
    {
        slug: 'thinking_traps',
    },
    {
        slug: 'learn_about_anxiety_loop',
    },
    {
        slug: 'psycho_education',
    },
    {
        slug: 'meditation_exercise',
    },
    {
        slug: 'emergency_resources',
    },
    {
        slug: 'video_exercise',
    },
    {
        slug: 'review_your_sleep_hygiene',
    },
    {
        slug: 'freewrite_journal',
    },
    {
        slug: 'survey_graph',
    },
];
