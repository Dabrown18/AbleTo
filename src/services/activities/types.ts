import { SurveyAnswer } from '../survey';
import {
    AssessmentGraphTemplateContent,
    AssessmentGraphTemplateOptions,
} from '@src/activities/templates/AssessmentGraph/types';
import { AudioTemplateContent, AudioTemplateOptions } from '@src/activities/templates/Audio/types';
import { BreatheTemplateContent, BreatheTemplateOptions } from '@src/activities/templates/Breathe/types';
import {
    BrightcoveVideoTemplateContent,
    BrightcoveVideoTemplateOptions,
} from '@src/activities/templates/BrightcoveVideo/types';
import { CelebrationTemplateContent, CelebrationTemplateOptions } from '@src/activities/templates/Celebration/types';
import { CopyTemplateContent, CopyTemplateOptions } from '@src/activities/templates/Copy/types';
import {
    EnterMoodTemplateContent,
    EnterMoodTemplateExitOptions,
    EnterMoodTemplateOptions,
} from '@src/activities/templates/EnterMood/types';
import { HabitEditorTemplateOptions } from '@src/activities/templates/HabitEditor/types';
import { HabitListTemplateContent, HabitListTemplateOptions } from '@src/activities/templates/HabitList/types';
import { HabitLogTemplateContent, HabitLogTemplateOptions } from '@src/activities/templates/HabitLog/types';
import { HabitProgressTemplateOptions } from '@src/activities/templates/HabitProgress/types';
import { JournalLogTemplateContent, JournalLogTemplateOptions } from '@src/activities/templates/JournalLog/types';
import { MoodLogTemplateContent, MoodLogTemplateOptions } from '@src/activities/templates/MoodLog/types';
import { QuestionTemplateContent, QuestionTemplateOptions } from '@src/activities/templates/Question/types';
import { SurveyTemplateOptions } from '@src/activities/templates/Survey/types';
import {
    TextEntryTemplateContent,
    TextEntryTemplateExitOptions,
    TextEntryTemplateOptions,
} from '@src/activities/templates/TextEntry/types';

export type ActivityController = 'MoodTracker'; // | OtherControler | ...

export type Template =
    | 'AbleToCopy'
    | 'AbleToEnterMood'
    | 'HabitLog'
    | 'HabitList'
    | 'HabitProgress'
    | 'HabitEditor'
    | 'AbleToTextEntry'
    | 'AbleToSurvey'
    | 'AbleToQuestion'
    | 'AbleToAssessmentGraph'
    | 'AbleToMoodLog'
    | 'Celebration'
    | 'AbleToAudio'
    | 'AbleToBreathe'
    | 'BrightcoveVideo'
    | 'JournalLog';

export type Predicate = any[];
export type SideEffect = any[];
export type Next = any[];

export type AsyncFunction = (...args: any) => Promise<any>;

export type ActivityStepShared = {
    predicate?: Predicate;
};

export type ActivityRouting = {
    predicate?: Predicate;
    sideEffects?: SideEffect[];
    next?: Next;
};

export type ActivityStepOptionsOverride = {
    predicate?: Predicate;
    mode?: string;
};

export type ActivityStepContentSource = {
    predicate?: Predicate;
    reduce?: string;
    use?: string;
};

export type ActivitySkipIf = Array<string | boolean>;

export type CompletionContentObject = {
    body: string;
    title: string;
    sort_slug: string;
};

export type CompletionContent = string | CompletionContentObject[];

export type PersistedUserActivity = {
    id: number;
    activity_slug: string;
    last_step_completed: string;
    program_activity_id: string;
    schema_version: number;
    started_at: string;
    state?: string;
    completed_at?: string;
    completion_content?: CompletionContent;
    content?: Record<string, unknown> | null;
    deleted?: boolean;
};

export type ActivityConfig = {
    slug: string;
    program_activity_id: string;
    controller?: ActivityController;
    name?: string;
    steps: ActivityStep[];
    options: ActivityOptions;
};

export type ActivityStep = {
    slug: string;
    template: Template;
    options: ActivityStepOptions;
    content: ActivityStepContent;
    routing?: ActivityRouting[];
    skipIf?: Predicate;
    exitOptions?: ActivityStepExitOptions;
    optionsOverride: ActivityStepOptionsOverride[];
    contentSource: ActivityStepContentSource[];
};

export type RootStackParamList = {
    Tabs: undefined;
    ActivityStep: {
        currentStep: ActivityStep;
    };
    Assessment: {
        assessmentSlug: string;
        stepIndex: number;
        options: SurveyTemplateOptions;
        answers: SurveyAnswer[];
    };
    WebView?: {
        initialUrl: string;
        isWebViewPadded?: boolean;
    };
    Article: {
        articleId: string;
    };
    Home: undefined;
    FindCare: undefined;
    Settings: undefined;
    Explore: undefined;
    Favorites: {
        path: string;
    };
    Support: undefined;
};

export type ActivityOptions = {
    startUserActivity: boolean;
    hasFeedback: boolean;
    showDialogOnLeave?: boolean;
};

export type ActivityContent = Record<string, unknown>;

export type ActivityStepContent = CopyTemplateContent &
    HabitLogTemplateContent &
    HabitListTemplateContent &
    EnterMoodTemplateContent &
    TextEntryTemplateContent &
    QuestionTemplateContent &
    AssessmentGraphTemplateContent &
    MoodLogTemplateContent &
    CelebrationTemplateContent &
    AudioTemplateContent &
    BreatheTemplateContent &
    BrightcoveVideoTemplateContent &
    JournalLogTemplateContent;

// These are options defined by the client application,
// and not coming from the backend. These are not specific to a certain template.
// Anything that the application needs to set, that is not persisted to
// Rails (like the continuedWith) can be added here.
type LocalActivityOptions = {
    continuedWith?: string;
};

export type ActivityStepOptions = LocalActivityOptions &
    CopyTemplateOptions &
    HabitLogTemplateOptions &
    HabitListTemplateOptions &
    HabitProgressTemplateOptions &
    HabitEditorTemplateOptions &
    EnterMoodTemplateOptions &
    TextEntryTemplateOptions &
    SurveyTemplateOptions &
    QuestionTemplateOptions &
    AssessmentGraphTemplateOptions &
    MoodLogTemplateOptions &
    CelebrationTemplateOptions &
    AudioTemplateOptions &
    BreatheTemplateOptions &
    BrightcoveVideoTemplateOptions &
    JournalLogTemplateOptions;

export type ActivityStepExitOptions = EnterMoodTemplateExitOptions & TextEntryTemplateExitOptions; // & OtherTemplateExitOptions
