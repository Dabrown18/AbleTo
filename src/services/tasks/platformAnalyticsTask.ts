import platformAnalytics from '@src/services/analytics/platformAnalytics';

const platformAnalyticsTask = async () => await platformAnalytics.flush(true);

export default platformAnalyticsTask;
