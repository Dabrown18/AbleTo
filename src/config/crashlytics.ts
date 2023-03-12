import crashlytics from '@react-native-firebase/crashlytics';

import { isDevBuild } from '@src/services/helpers';
import { getIdpInstanceId } from '@src/services/idp';

// Enable crashlytics for staging/prod
crashlytics().setCrashlyticsCollectionEnabled(!isDevBuild);

getIdpInstanceId().then((id) => crashlytics().setUserId(id));
