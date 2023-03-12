import { User } from './user';

export type ProgramIndication =
    | 'depression'
    | 'social_anxiety'
    | 'subclinical'
    | 'generalized_anxiety'
    | 'life_transition'
    | 'alcohol_or_drugs'
    | 'bipolar'
    | 'ptsd'
    | 'suicidality'
    | 'eating_disorder'
    | 'psychosis'
    | 'stress'
    | 'other';

export type ProgramLevel = 'basic' | 'standard' | 'concierge' | 'tplus' | 'pbh' | 't360' | 'self_care';

export type ProgramRolloutPeriod =
    | 'daily'
    | 'weekly'
    | 'manual_weekly'
    | 'manual_steps'
    | 'monthly'
    | 'chapter'
    | 'none';

// @todo: Check should happen inside of CurrentTreatment, not user
export const isSelfCare = (user: User) => user.program_level === 'self_care';
