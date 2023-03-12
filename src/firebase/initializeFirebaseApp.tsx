import firebase from '@react-native-firebase/app';

type FirebaseConfigurationTypes = 'FCM_PRODUCTION' | 'FCM_STAGING' | 'AUTH_PRODUCTION' | 'AUTH_STAGING' | 'AUTH_LOCAL';

const FirebaseConfigurations = {
    FCM_PRODUCTION: import('./fcm/google-services-prod.json'),
    FCM_STAGING: import('./fcm/google-services-staging.json'),
    AUTH_PRODUCTION: import('./auth/google-services-prod.json'),
    AUTH_STAGING: import('./auth/google-services-staging.json'),
    AUTH_LOCAL: import('./auth/google-services-local.json'),
};

const initializeFirebaseApp = async (appName: FirebaseConfigurationTypes) => {
    try {
        const credentials = await firebaseConfigLoader(appName);
        const config = {
            name: appName.includes('AUTH') ? 'AUTH' : 'FCM',
        };
        const apps = firebase.apps;

        const appExists = apps.find((app) => {
            return app.name === config.name;
        });

        if (appExists) {
            await firebase.app(appExists.name).delete();
        }

        await firebase.initializeApp(credentials, config);
    } catch (error) {
        console.log('[ERROR]: Failed to initialize Firebase application: ', error);
    }
};

const firebaseConfigLoader = async (firebaseConfigurationType: FirebaseConfigurationTypes) => {
    const configFile = await FirebaseConfigurations[firebaseConfigurationType];

    const config = {
        appId: configFile.client[0].client_info.mobilesdk_app_id,
        apiKey: configFile.client[0].api_key[0].current_key,
        databaseURL: '',
        storageBucket: configFile.project_info.storage_bucket,
        messagingSenderId: '',
        projectId: configFile.project_info.project_id,
    };

    return config;
};

export default initializeFirebaseApp;
