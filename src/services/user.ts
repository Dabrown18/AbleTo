import { sortByDate } from './helpers';
import Logger from './logger';
import { ProgramIndication, ProgramLevel, ProgramRolloutPeriod } from './program';
import request from './request';
import queryClient from '@src/config/queryClient';

type UserRole = 'client' | 'coach' | 'admin' | 'moderator';

export type User = {
    id: number;
    external_id?: string;
    coach_id?: number;
    email?: string;
    password?: string;
    role: UserRole;
    onboarding_complete: boolean;
    experiments: any; // @todo: Add type
    recent_activities: number;
    program_indication: ProgramIndication;
    program_level: ProgramLevel;
    program_slug: string; // @todo: Type!
    program_rollout_period: ProgramRolloutPeriod;
    sso_id?: string;
    is_guest: boolean;
    channel?: boolean;
    preferred_locale?: string;
    insurance_member_id?: string;
};

export type Profile = {
    accepts_coach_notice_and_terms?: boolean;
    accepts_data_storage?: boolean;
    accepts_health_data_processing?: boolean;
    age?: number;
    benefit_eligible?: boolean;
    benefit_payment_responsibility: Array<any>;
    benefit_product_suitability: Array<any>;
    benefit_product_target: Array<any>;
    comms_opt_in: boolean;
    complete: boolean;
    country?: string;
    dob?: string;
    first_name?: string;
    gender?: string;
    id: number;
    last_name?: string;
    pending_jiff_fix?: boolean;
    phone?: string;
    phone_E164?: string;
    skipped_jiff?: boolean;
    state?: string;
    updated_at: string;
    user_id?: number;
    zip?: number;
};

export type TreatmentStatus = 'ic_fua' | 'missed_ic_fua' | 'in_treatment' | 'cancelled' | 'finished';
export const ACTIVE_TREATMENT_STATUSES: TreatmentStatus[] = ['ic_fua', 'missed_ic_fua', 'in_treatment'];

export type Treatment = {
    id: number;
    user_id?: number;
    status?: TreatmentStatus;
    product_line?: string; // @todo: Type!
    program?: string; // @todo: Type!
    session_protocol_code?: string;
    previous_status?: TreatmentStatus;
    e2_treatment_id?: string;
    updated_at?: Date;
    is_self_guided?: boolean;
};

export type UserData = {
    user: User;
    profiles: Profile[];
    treatments?: Treatment[];
    // @todo: the response returns more properties
    // but they aren't typed yet
};

export const getSelf = async (): Promise<UserData> =>
    await queryClient.fetchQuery(['getSelf'], async () => {
        try {
            const { data } = await request.get('/users/me');

            // @todo: This sideloads a bunch of stuff, that we could cache
            return data;
        } catch (error) {
            throw new Error('Failed to fetch user information');
        }
    });

export const updateSelf = async (userProfile: Profile) => {
    try {
        await request.put('/profile', { profile: userProfile });
    } catch (error) {
        Logger.error(error, 'Failed to update user profile');
    }
};

export const getCurrentTreatment = (treatments: Treatment[] | undefined): Treatment | null => {
    if (!treatments || treatments.length === 0) return null;

    const activeTreatment = treatments.find(
        (treatment) => treatment.status && ACTIVE_TREATMENT_STATUSES.includes(treatment.status)
    );
    if (activeTreatment) return activeTreatment;

    const latestTreatment = sortByDate(treatments, 'updated_at', false)[0];
    if (latestTreatment) return latestTreatment;

    return null;
};
