import { RouteProp, useIsFocused, useLinkTo, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useStartActivity from './useStartActivity';
import { activityControllerActions } from '@src/redux/slices/ActivityControllerSlice';
import { selectActivityIsBeingInitialized } from '@src/redux/slices/ActivityControllerSlice/selectors';
import { RootStackParamList } from '@src/services/activities/types';
import analytics from '@src/services/analytics/analytics';
import {
    ActivityLink,
    AppViewLink,
    ArticleLink,
    Link,
    SupportedLinkContentTypesEnum,
    UrlLink,
} from '@src/services/article';
import { isActivitySupported, openLink } from '@src/services/helpers';

/**
 * Exposes an event handler for different types of Article Anchors.
 * When provided with an activityLink it starts up an activity.
 * When provided with an urlLink it opens up the url in an external browser.
 * When provided with an articleLink it navigates to the Article screen, providing it the Article ID.
 * @todo: appViewLinks are not supported yet
 */
const useArticleAnchor = (link: Link) => {
    const linkTo = useLinkTo();
    const { startActivity } = useStartActivity();
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const activityIsBeingInitialized = useSelector(selectActivityIsBeingInitialized);
    const { params }: RouteProp<{ params: { articleId: string } }, 'params'> = useRoute();
    const [from, setFrom] = useState('');
    const dispatch = useDispatch();
    const { setActivityIsBeingInitialized } = activityControllerActions;
    const isFocused = useIsFocused();

    useEffect(() => {
        setFrom(params.articleId);
    }, [params]);

    const handlePress = useCallback(() => {
        const { contentType } = link;

        // We always want to check if the screen is already in focus
        // before allowing further execution to prevent propagating tap events before the next screen was loaded
        // for all content types.
        if (!isFocused) return;

        //We only need activityIsBeingInitialized for activityLink content type
        if (link.contentType === SupportedLinkContentTypesEnum.ACTIVITY_LINK && !activityIsBeingInitialized) {
            if (isActivitySupported(link.programActivityId, link.slug)) dispatch(setActivityIsBeingInitialized(true));

            const { slug, programActivityId } = link as ActivityLink;
            const analyticProps = {
                linkType: contentType,
                slug: slug,
                programActivityId: programActivityId,
                from,
            };
            analytics.followedLink(analyticProps);

            startActivity({ activitySlug: slug, programActivityId });

            return;
        }

        if (link.contentType === SupportedLinkContentTypesEnum.URL_LINK) {
            const { url, requiresAuthentication } = link as UrlLink;
            const analyticProps = { linkType: contentType, url: url, from };
            analytics.followedLink(analyticProps);
            openLink(url, requiresAuthentication);
            return;
        }

        if (link.contentType === SupportedLinkContentTypesEnum.ARTICLE_LINK) {
            const { articleId } = link as ArticleLink;
            const analyticProps = { articleId, linkType: contentType, from };
            analytics.followedLink(analyticProps);
            rootNavigation.push('Article', { articleId });
            return;
        }

        if (link.contentType === SupportedLinkContentTypesEnum.APP_VIEW_LINK) {
            const { path } = link as AppViewLink;
            const analyticProps = { linkType: contentType, path: path, from };
            analytics.followedLink(analyticProps);
            linkTo(path);
            return;
        }
    }, [
        link,
        isFocused,
        activityIsBeingInitialized,
        dispatch,
        setActivityIsBeingInitialized,
        from,
        startActivity,
        rootNavigation,
        linkTo,
    ]);

    return handlePress;
};

export default useArticleAnchor;
