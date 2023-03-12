import request from './request';
import queryClient from '@src/config/queryClient';

// @todo: Type out 'any's
type UserProgram = {
    cancelled_activity_id_suffix?: string;
    choice?: string;
    experience_type?: string;
    finished_at?: string;
    id: number;
    indication: string;
    level: string;
    onboarding_complete: boolean;
    pdf_tools?: any;
    period: number;
    recommended_standard_indication: string;
    recommended_standard_program: string;
    slug: string;
    stage_choices?: any;
    started_at: string;
    suggested_tools_by_period?: any;
    toolbox_activity_id_suffix?: any;
    toolbox_categories: any[];
};

export const fetchUserProgramUncached = async (): Promise<UserProgram> => {
    try {
        const { data } = await request.get('/user_programs', { params: { user_id: 'me' } });
        return data.user_program;
    } catch (error) {
        throw new Error('Failed to fetch user programs');
    }
};

export const fetchUserProgram = () => queryClient.fetchQuery(['fetchUserPrograms'], fetchUserProgramUncached);
