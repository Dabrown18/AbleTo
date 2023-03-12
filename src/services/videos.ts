import { BRIGHTCOVE_SANVELLO_ACCOUNT_ID, BRIGHTCOVE_SANVELLO_POLICY_KEY } from 'react-native-dotenv';

import Logger from './logger';
import request from './request';

const BRIGHTCOVE_API_URL = 'https://edge.api.brightcove.com/playback/v1';

export type Source = {
    src: string;
    codecs?: string;
    ext_x_version?: string;
    type?: string;
    profiles?: string;
    avg_bitrate?: number;
    codec?: string;
    container?: string;
    duration?: number;
    height?: number;
    size?: number;
    width?: number;
};

export type TextTrack = {
    id: string | null;
    account_id: string;
    src: string;
    srclang: string | null;
    label: string;
    kind: 'captions' | 'subtitles' | 'description' | 'chapters' | 'metadata';
    mime_type: string;
    asset_id: unknown | null;
    sources: Record<'src', string>[] | null;
    in_band_metadata_dispatch_data: string;
    default: boolean;
    width?: number;
    height?: number;
    bandwidth?: number;
};

export type VideoData = {
    poster: string;
    thumbnail: string;
    poster_sources: Record<'src', string>[];
    thumbnail_sources: Record<'src', string>[];
    description: string | null;
    tags: string[];
    cue_points: any[];
    custom_fileds: Record<any, any>;
    account_id: string;
    sources: Source[];
    name: string;
    reference_id: string | null;
    long_description: string | null;
    duration: number;
    economics: string;
    text_tracks: TextTrack[];
    published_at: string;
    created_at: string;
    updated_at: string;
    offline_enabled: boolean;
    link: string | null;
    id: string;
    ad_keys: unknown | null;
};

export const fetchVideoData = async (videoId: string): Promise<VideoData> => {
    try {
        const { data } = await request.get(
            `${BRIGHTCOVE_API_URL}/accounts/${BRIGHTCOVE_SANVELLO_ACCOUNT_ID}/videos/${videoId}`,
            {
                headers: {
                    Accept: `application/json;pk=${BRIGHTCOVE_SANVELLO_POLICY_KEY}`,
                },
            }
        );
        return data;
    } catch (error) {
        Logger.error(error, `Failed to fetch video with id ${videoId}`);
        throw new Error(error.message);
    }
};
