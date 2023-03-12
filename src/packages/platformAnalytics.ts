import { NativeModules } from 'react-native';

type PlatformAnalyticsModule = {
    startService: () => void;
};

const PlatformAnalytics: PlatformAnalyticsModule = NativeModules.PlatformAnalytics;

export default PlatformAnalytics;
