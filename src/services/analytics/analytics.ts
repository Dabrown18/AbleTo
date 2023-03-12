import { Mixpanel, MixpanelProperties, People } from 'mixpanel-react-native';
import { MIXPANEL_TOKEN } from 'react-native-dotenv';

import { AnalyticProps } from '../article';
import { isDebug, isDevBuild } from '../helpers';
import platformAnalytics from '@src/services/analytics/platformAnalytics';
import { getIdpInstanceId } from '@src/services/idp';
import { UserData } from '@src/services/user';

const mixpanel = new Mixpanel(MIXPANEL_TOKEN);
mixpanel.init();

const people = new People(MIXPANEL_TOKEN);

const flushIfIsDebug = () => {
    if (isDebug) mixpanel.flush();
};

const analytics = {
    track: (eventName: string, properties?: MixpanelProperties) => {
        if (isDevBuild) return;
        mixpanel.track(eventName, properties);
        flushIfIsDebug();

        platformAnalytics.track(eventName, properties);
    },

    tapped: (description: string, properties?: MixpanelProperties) => {
        if (isDevBuild) return;
        analytics.track('Tapped', { Description: description, ...properties });
        flushIfIsDebug();
    },

    tappedButton: (viewName: string, buttonName: string, properties?: MixpanelProperties) => {
        if (isDevBuild) return;
        analytics.track(`${viewName} ${buttonName}`, properties);
        flushIfIsDebug();
    },

    viewed: (viewName: string, properties?: MixpanelProperties) => {
        if (isDevBuild) return;
        analytics.track(`Viewed ${viewName} screen`, properties);
        flushIfIsDebug();
    },

    reset: async (self: UserData) => {
        if (isDevBuild) return;
        mixpanel.reset();
        await platformAnalytics.reset();

        await analytics.identifyUser(self);
    },

    identifyUser: async (self: UserData) => {
        if (isDevBuild) return;
        mixpanel.registerSuperProperties({
            program_slug: self.user.program_slug,
            program_level: self.user.program_level,
        });
        mixpanel.identify(self.user.id.toString());
        people.set('email', self.user.email);
        const first_name = self.profiles.find((profile) => profile.user_id === self.user.id)?.first_name;
        people.set('first_name', first_name);
        people.set('Crashlytics Identifier', await getIdpInstanceId());

        platformAnalytics.registerSuperProperties(self);
    },

    identifyGuestUser: async (self: UserData) => {
        if (isDevBuild) return;
        mixpanel.reset();
        mixpanel.identify(self.user.id.toString());
    },

    followedLink: (analyticProps: AnalyticProps) => {
        if (isDevBuild) return;
        analytics.track(`FollowedLink`, analyticProps);
        flushIfIsDebug();
    },

    launchedActivity: (slug: string, programActivityId: string | undefined, from: string) => {
        if (isDevBuild) return;
        analytics.track(`LaunchedActivity`, { slug, programActivityId, from });
        flushIfIsDebug();
    },

    exitedActivity: (slug: string, programActivityId: string, completed: boolean) => {
        if (isDevBuild) return;
        analytics.track(`ExitedActivity`, { slug, programActivityId, completed });
        flushIfIsDebug();
    },

    enteredHabitEditor: (slug: string, programActivityId: string, from: string) => {
        if (isDevBuild) return;
        analytics.track(`EnteredHabitEditor`, { slug, programActivityId, from });
        flushIfIsDebug();
    },

    exitedHabitEditor: (slug: string, programActivityId: string, completed: boolean) => {
        if (isDevBuild) return;
        analytics.track(`ExitedHabitEditor`, { slug, programActivityId, completed });
        flushIfIsDebug();
    },
};

export default analytics;
