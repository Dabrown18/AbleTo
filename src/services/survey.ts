import Logger from './logger';
import request from './request';
import queryClient from '@src/config/queryClient';

export type SurveyAnswer = {
    question_slug: string;
    prompt: string;
    rating: number;
};

export type SurveyQuestion = {
    category: string | null;
    prompt: string;
    slug: string;
};

export type SurveyScore = {
    num_activities: number;
    score: number;
    snapshot_id: number;
};

export type Survey = {
    answer_images: string[];
    answer_type: string;
    answers: string[];
    categories: string[];
    minimum_displayed_categories: number | null;
    pad_categories: string | null;
    prompt: string;
    questions: SurveyQuestion[];
    slug: string;
};

export const getSurveyDetails = async (surveySlug: string): Promise<Survey> =>
    await queryClient.fetchQuery(['getSurveyDetails', { surveySlug }], async () => {
        try {
            const { data } = await request.get(`/surveys/${surveySlug}`);

            return data.survey;
        } catch (error) {
            Logger.error(error, `Failed to get ${surveySlug} survey config`);
        }
    });

export const getSurveyScores = async (surveySlug: string): Promise<SurveyScore[]> =>
    await queryClient.fetchQuery(['getSurveyScores', { surveySlug }], async () => {
        try {
            const { data } = await request.get(`/surveys/${surveySlug}/scores`);

            return data.scores?.scores;
        } catch (error) {
            Logger.error(error, `Failed to get ${surveySlug} survey scores`);
        }
    });

export const saveSurveyAnswers = async (answers: SurveyAnswer[]) => {
    try {
        await request.post('/survey_results?user_id=me', { survey_result: { answers } });
    } catch (error) {
        Logger.error(error, 'Failed to save survey answers');
    }
};

export const saveSurveySnapshot = async (surveySlug: string) => {
    try {
        queryClient.invalidateQueries(['getSurveyScores', { surveySlug }]);
        await request.post(`/surveys/${surveySlug}/scores`, { activity_slug: null });
    } catch (error) {
        Logger.error(error, `Failed to save ${surveySlug} Survey Snapshot `);
    }
};
