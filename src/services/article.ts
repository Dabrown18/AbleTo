import Logger from './logger';
import request from './request';
import { SupportedHeaderVariantsEnum } from '@src/components/articles/items/HeadingItem';
import queryClient from '@src/config/queryClient';
import useFocusRefetchQuery from '@src/hooks/useFocusRefetchQuery';

export enum SupportedAppViewLinkPathsEnum {
    HOME = '/home',
    EXPLORE = '/explore',
    FAVORITES = '/favorites',
    FIND_CARE = '/find-care',
    SETTINGS = '/settings',
}

export enum SupportedLinkContentTypesEnum {
    APP_VIEW_LINK = 'appViewLink',
    ARTICLE_LINK = 'articleLink',
    ACTIVITY_LINK = 'activityLink',
    URL_LINK = 'urlLink',
}

export type Article = {
    id: string;
    contentType: 'article';
    sections: Section[];
    name?: string;
};

export type Section = {
    contentType: 'section';
    items: Item[];
};

// Possible Article Items
export type Item = AnchorItem | HeadingItem | CardItem | BodyItem | TrackerItem | SubHeadingItem | HeaderItem;

export type HeaderItem = {
    id: string;
    contentType: 'header';
    media?: string;
    mainHeading: HeadingItem;
    subheading?: SubHeadingItem;
    body?: BodyItem;
    emergencyResourceButton?: boolean;
};

export type TrackerItem = {
    contentType: 'tracker';
    activityType: string;
    imageName: string;
    text: string;
};

export type BodyItem = {
    contentType: 'body';
    text: string;
    variant: 'regular' | 'sm' | 'xs';
};

export type CardItem = {
    contentType: 'card';
    heading: string;
    coverImage: string;
    link: Link;
    size: 'halfWidth' | 'fullWidthShort' | 'fullWidthFeatured';
    type:
        | 'listen'
        | 'read'
        | 'collection'
        | 'practice'
        | 'track'
        | 'breathe'
        | 'watch'
        | 'meditate'
        | 'checkIn'
        | 'story';
    duration: number;
    authorName?: string;
};

export type HeadingItem = {
    contentType: 'heading';
    text: string;
    variant: SupportedHeaderVariantsEnum;
};

export type SubHeadingItem = {
    id: string;
    contentType: 'subheading';
    text: string;
};

export type AnchorItem = {
    contentType: 'anchor';
    name: string;
    text: string;
    icon: string;
    link: Link;
};

export type Link = AppViewLink | ArticleLink | ActivityLink | UrlLink;

export type AppViewLink = {
    contentType: SupportedLinkContentTypesEnum.APP_VIEW_LINK;
    path: SupportedAppViewLinkPathsEnum;
};

export type ArticleLink = {
    contentType: SupportedLinkContentTypesEnum.ARTICLE_LINK;
    articleId: string;
};

export type ActivityLink = {
    contentType: SupportedLinkContentTypesEnum.ACTIVITY_LINK;
    slug: string;
    programActivityId: string;
};

export type UrlLink = {
    contentType: SupportedLinkContentTypesEnum.URL_LINK;
    url: string;
    requiresAuthentication: boolean;
};

export type AnalyticProps = {
    linkType: string;
    from: string;
    slug?: string;
    programActivityId?: string;
    articleId?: string;
    path?: string;
    url?: string;
};

export const contentTypeMap = {
    activityLink: 'Activity',
    urlLink: 'URL',
    articleLink: 'Article',
    appViewLink: 'Navigate',
};

export const getArticle = async (articleId: string): Promise<Article | null> => {
    try {
        const { data } = await request.get(`/articles/${articleId}`);
        return data.article;
    } catch (error) {
        Logger.error(error, `Failed to load article: ${articleId}`);
        return null;
    }
};

export const useGetArticle = (articleId: string) => {
    return useFocusRefetchQuery(['getArticle', { articleId }], () => getArticle(articleId), { staleTime: 0 });
};

/**
 * Manually invalidate the cache of an article (which is usually cached for 5 minutes).
 * Useful when performing any activity, that might affect an article's content (i.e an assessment)
 */
export const invalidateArticleCache = (articleId: string) =>
    queryClient.invalidateQueries(['getArticle', { articleId }]);

export const shouldRenderCardOrAnchor = (item: AnchorItem | CardItem) => {
    if (
        !linkContentTypeExists(item.link.contentType) ||
        (item.link.contentType === SupportedLinkContentTypesEnum.APP_VIEW_LINK &&
            !appViewLinkPathExists(item.link.path))
    ) {
        return false;
    }

    return true;
};

export const linkContentTypeExists = (value: SupportedLinkContentTypesEnum) => {
    return Object.values(SupportedLinkContentTypesEnum).includes(value);
};

export const appViewLinkPathExists = (value: SupportedAppViewLinkPathsEnum) => {
    return Object.values(SupportedAppViewLinkPathsEnum).includes(value);
};
