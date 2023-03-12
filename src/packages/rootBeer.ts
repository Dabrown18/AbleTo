import { NativeModules } from 'react-native';

type RootBeer = {
    isRooted(): Promise<boolean>;
};

const RootBeer: RootBeer = NativeModules.RootBeer;

export default RootBeer;
