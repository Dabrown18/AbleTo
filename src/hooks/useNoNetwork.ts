import { useNetInfo } from '@react-native-community/netinfo';

/**
 * A hook that returns true if the device is not connected to the internet.
 * This includes cases where the device might be connected to a network, but
 * the network is not connected to the internet.
 */
const useNoInternet = () => useNetInfo().isInternetReachable === false;

export default useNoInternet;
