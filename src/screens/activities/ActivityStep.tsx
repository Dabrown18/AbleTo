import { StackScreenProps } from '@react-navigation/stack';
import React, { FunctionComponent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';

import Templates from '@src/activities/templates';
import ActivityNavigation from '@src/components/activities/ActivityNavigation';
import ScreenScrollView from '@src/components/ScreenScrollView';
import { BodyText, LoadingIndicator } from '@src/core';
import useBackHandler from '@src/hooks/useBackHandler';
import { selectActivityController } from '@src/redux/slices/ActivityControllerSlice/selectors';
import { dialogActions } from '@src/redux/slices/dialogSlice';
import { RootStackParamList } from '@src/services/activities/types';

type ScreenProps = StackScreenProps<RootStackParamList, 'ActivityStep'>;

const ActivityStep: FunctionComponent<ScreenProps> = ({ route }) => {
    const controller = useSelector(selectActivityController);

    const dispatch = useDispatch();
    const { setShouldShowActivityBackConfirmation } = dialogActions;

    const { currentStep } = route.params;

    const handleBack = useCallback(() => {
        if (currentStep.exitOptions?.showDialogOnBack) {
            dispatch(setShouldShowActivityBackConfirmation(true));
        } else {
            controller?.stepBack();
        }

        return true;
    }, [controller, currentStep.exitOptions?.showDialogOnBack, dispatch, setShouldShowActivityBackConfirmation]);

    useBackHandler(handleBack);

    if (!currentStep) return <LoadingIndicator fullScreen />;

    const Template = Templates[currentStep.template];

    return (
        <>
            {Template ? (
                <Template
                    activitySlug={controller?.activityConfig?.slug ?? ''}
                    stepSlug={currentStep.slug ?? ''}
                    options={currentStep.options}
                    content={currentStep.content}
                />
            ) : (
                // @todo: Will need a better fallback, if we don't have the template for some reason
                // This is very much for testing purposes, while we build out templates
                <Container>
                    <ScrollView>
                        <BodyText>Couldn't find this template</BodyText>
                        <BodyText> {JSON.stringify(currentStep, null, 2)} </BodyText>
                    </ScrollView>

                    <ActivityNavigation />
                </Container>
            )}
        </>
    );
};

const Container = styled.View`
    flex: 1;
`;

const ScrollView = styled(ScreenScrollView)`
    padding: 20px 0;
`;

export default ActivityStep;
