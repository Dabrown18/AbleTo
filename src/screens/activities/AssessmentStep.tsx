import { useIsFocused } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import useSurveyEngine from '@src/activities/templates/Survey/useSurveyEngine';
import ScreenScrollView from '@src/components/ScreenScrollView';
import { BodyText, HeaderText, LabelText } from '@src/core';
import useDidMount from '@src/hooks/useDidMount';
import { selectActivityController } from '@src/redux/slices/ActivityControllerSlice/selectors';
import { RootStackParamList } from '@src/services/activities/types';

type ScreenProps = StackScreenProps<RootStackParamList, 'Assessment'>;

const AssessmentStep: FunctionComponent<ScreenProps> = ({ route, navigation }) => {
    const { assessmentSlug, stepIndex, options, answers } = route.params;

    const controller = useSelector(selectActivityController);
    const isFocused = useIsFocused();

    const { currentQuestion, surveyDetails, markAnswer } = useSurveyEngine({
        slug: assessmentSlug,
        currentStep: stepIndex,
        options,
        answers,
    });

    useDidMount(() => {
        if (stepIndex !== 0) return;

        // If this is the 1st assessment step, we want to persist the
        // activity in our ActivityController. For navigating back
        // the `stepBackAssessment` function in `RootNavigation` is
        // responsible.
        navigation.addListener('beforeRemove', ({ data }) => {
            // We only care about back actions. Exiting the activity should
            // behave as normal.
            if (data.action.type === 'POP_TO_TOP') return;

            controller?.persistToUserActivity();

            navigation.dispatch(data.action);
        });
    });

    if (!surveyDetails || !currentQuestion) return null;

    return (
        <Container testID="assessment-step-container">
            <ScrollView>
                <QuestionHeader>
                    <SurveyPrompt variant="h5">{surveyDetails.prompt}</SurveyPrompt>

                    <QuestionPrompt variant="h3">{currentQuestion.prompt}</QuestionPrompt>
                </QuestionHeader>

                <Answers>
                    {surveyDetails.answers.map((answer, index) => (
                        <Answer
                            key={answer}
                            onPress={() => {
                                if (!isFocused) return;
                                markAnswer(index);
                            }}
                            accessibilityLabel={answer}
                            accessibilityRole="button"
                        >
                            <AnswerText importantForAccessibility="no-hide-descendants">{answer}</AnswerText>

                            <AnswerRatingContainer importantForAccessibility="no-hide-descendants">
                                <AnswerRating variant="l2">{index}</AnswerRating>
                            </AnswerRatingContainer>
                        </Answer>
                    ))}
                </Answers>
            </ScrollView>
        </Container>
    );
};

const Container = styled.View`
    flex: 1;
`;

const ScrollView = styled(ScreenScrollView)`
    padding: 0;
    background-color: transparent;
    justify-content: space-between;
`;

const QuestionHeader = styled.View`
    background-color: ${({ theme }) => theme.colors.white};
    padding: 30px 20px;
    flex: 2;
`;

const SurveyPrompt = styled(HeaderText)`
    color: ${({ theme }) => theme.colors.gray800};
`;

const QuestionPrompt = styled(HeaderText)`
    color: ${({ theme }) => theme.colors.gray900};
`;

const Answers = styled.View`
    background-color: ${({ theme }) => theme.colors.creamBackground};
    flex: 1;
    width: 100%;
    padding: 30px 20px;
`;

const Answer = styled.Pressable`
    background-color: ${({ theme }) => theme.colors.white};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    elevation: 3;
    margin: 12px 0;
    padding: 15px 20px;
    border: 1px solid;
    border-color: ${({ theme }) => theme.colors.gray100};
    border-radius: 4px;
`;

const AnswerText = styled(BodyText)`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray800};
`;

const AnswerRatingContainer = styled.View`
    padding: 0 6px;
    background-color: ${({ theme }) => theme.colors.teal50};
    border: 1px solid;
    border-color: ${({ theme }) => theme.colors.teal100};
    border-radius: 2px;
`;

const AnswerRating = styled(LabelText)`
    text-align: center;
    color: ${({ theme }) => theme.colors.teal600};
`;

export default AssessmentStep;
