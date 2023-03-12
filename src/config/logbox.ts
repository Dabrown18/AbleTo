import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    // This is not an actual warning. This project already uses the new GestureDetector system,
    // but a dependency (@react-navigation/stack) is using the previous API (which is still supported)
    // which is giving us this annoying warning when the app starts up. So let's ignore it!
    "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    // This is a log coming internally, from a dependency of a dependency. It is documented here:
    // https://github.com/FormidableLabs/victory/issues/2230
    'Require cycle: node_modules/victory',
]);
