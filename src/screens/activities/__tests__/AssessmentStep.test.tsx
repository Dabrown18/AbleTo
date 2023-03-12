import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';

import AssessmentStep from '../AssessmentStep';
import * as surveyService from '@src/services/survey';
import mockNavigation from '@src/utils/mocks/navigation';
import { renderWithAppProviders } from '@src/utils/testing';

const assessmentSlug = 'gad7';
const options = { slug: 'gad7', recordSnapshotOnCompletion: false };

const assessmentParams = {
    assessmentSlug,
    stepIndex: 0,
    options,
    answers: [],
};

const surveyDetails = {
    answer_images: [],
    answer_type: 'phq9',
    answers: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    categories: [],
    minimum_displayed_categories: null,
    pad_categories: null,
    prompt: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    questions: [
        {
            slug: 'gad7_01',
            prompt: 'Feeling nervous, anxious, or on edge',
            category: null,
        },
        {
            slug: 'gad7_02',
            prompt: 'Not being able to stop or control worrying',
            category: null,
        },
    ],
    slug: 'gad7',
};

const answerRatings = [0, 1, 2, 3];

const renderAssessmentStep = async (routeParams: any) => {
    return renderWithAppProviders(
        <AssessmentStep route={{ params: routeParams } as any} navigation={mockNavigation as any} />
    );
};

describe('Assessment Step Tests', () => {
    const getSurveyDetails = jest
        .spyOn(surveyService, 'getSurveyDetails')
        .mockImplementation(() => Promise.resolve(surveyDetails));

    const saveSurveyAnswers = jest
        .spyOn(surveyService, 'saveSurveyAnswers')
        .mockImplementation(() => Promise.resolve());

    it('renders the prompts for the first step and sends a request for fetching survey details', async () => {
        await renderAssessmentStep(assessmentParams);

        const assessmentStepContainer = await screen.findByTestId('assessment-step-container');
        const surveyPrompt = await screen.findByText(surveyDetails.prompt);
        const questionPrompt = await screen.findByText(surveyDetails.questions[assessmentParams.stepIndex].prompt);

        expect(assessmentStepContainer).toBeTruthy();
        expect(surveyPrompt).toBeTruthy();
        expect(questionPrompt).toBeTruthy();

        expect(getSurveyDetails).toHaveBeenCalledWith(assessmentSlug);
    });

    it('renders the answers', async () => {
        await renderAssessmentStep(assessmentParams);

        const firstAnswer = await screen.findByText(surveyDetails.answers[0]);
        const secondAnswer = await screen.findByText(surveyDetails.answers[1]);
        const thirdAnswer = await screen.findByText(surveyDetails.answers[2]);
        const fourthAnswer = await screen.findByText(surveyDetails.answers[3]);

        const firstAnswerRating = await screen.findByText(answerRatings[0].toString());
        const secondAnswerRating = await screen.findByText(answerRatings[1].toString());
        const thirdAnswerRating = await screen.findByText(answerRatings[2].toString());
        const fourthAnswerRating = await screen.findByText(answerRatings[3].toString());

        expect(firstAnswer).toBeTruthy();
        expect(secondAnswer).toBeTruthy();
        expect(thirdAnswer).toBeTruthy();
        expect(fourthAnswer).toBeTruthy();
        expect(firstAnswerRating).toBeTruthy();
        expect(secondAnswerRating).toBeTruthy();
        expect(thirdAnswerRating).toBeTruthy();
        expect(fourthAnswerRating).toBeTruthy();
    });

    it('renders the question prompt for the second step', async () => {
        await renderAssessmentStep({
            ...assessmentParams,
            stepIndex: 1,
        });

        const questionPrompt = await screen.findByText(surveyDetails.questions[1].prompt);

        expect(questionPrompt).toBeTruthy();
    });

    it('saves answer on press on last step', async () => {
        await renderAssessmentStep({
            ...assessmentParams,
            stepIndex: 1,
        });

        const firstAnswer = await screen.findByText(surveyDetails.answers[0]);

        fireEvent.press(firstAnswer);

        expect(saveSurveyAnswers).toHaveBeenCalledWith([
            {
                prompt: surveyDetails.questions[1].prompt,
                question_slug: surveyDetails.questions[1].slug,
                rating: answerRatings[0],
            },
        ]);
    });
});
