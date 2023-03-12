import * as Sentry from '@sentry/react-native';
import { ENVIRONMENT, SENTRY_DIST, SENTRY_DSN } from 'react-native-dotenv';

import { version } from '../../package.json';
import {
    PLATFORM_ANALYTICS_ERROR,
    PLATFORM_ANALYTICS_ERROR_BACKGROUND,
} from '@src/services/analytics/platformAnalytics';
import { Doorman } from '@src/services/doorman';
import { isDevBuild, isStagingBuild } from '@src/services/helpers';

export const initializeSentry = () => {
    if (isDevBuild) {return;}

    Sentry.init({
        dsn: SENTRY_DSN,
        // Adds additional (in-app) logging
        // Useful for catching any errors while trying to report to Sentry
        debug: isStagingBuild,
        environment: ENVIRONMENT,
        release: version,
        // @todo: This will need to be incremented, once we start
        // automatically generating sourcemaps
        dist: SENTRY_DIST ?? '1',
        // We have a self-hosted Sentry instance,
        // allowing us to be liberal with PII
        // In this case this will log emails and IDs
        sendDefaultPii: true,
        beforeSend: (event) => {
            if (event.fingerprint) {
                const errorMessage = event.fingerprint[0];

                // @todo: We have failing requests for the platform analytics service, so we decided to not show
                // the `GenericErrorDialog`. Consider removing this check once the requests are fixed and passing or
                // refactor to not rely on this string check. Perhaps we could do this check in `logger.ts` where
                // have the exact error.
                if (errorMessage === PLATFORM_ANALYTICS_ERROR || errorMessage === PLATFORM_ANALYTICS_ERROR_BACKGROUND) {
                    return event;
                }
            }

            // Show the Generic Error popup
            // when Sentry catches an uncaught error
            Doorman.genericErrorEvent();

            return event;
        },
    });
};
