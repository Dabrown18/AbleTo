import { DeviceEventEmitter } from 'react-native';

import ActivityController from '@src/activities/controller/ActivityController';

export const Doorman = {
    guard(fn: () => void) {
        return DeviceEventEmitter.addListener('UNAUTHORIZED', fn);
    },

    lock() {
        DeviceEventEmitter.emit('UNAUTHORIZED');
    },

    upgrade(fn: () => void) {
        return DeviceEventEmitter.addListener('UPGRADE', fn);
    },

    emitUpgrade() {
        DeviceEventEmitter.emit('UPGRADE');
    },

    unableToOpenUrlListener(fn: (isMailLink: boolean) => void) {
        return DeviceEventEmitter.addListener('UNABLETOOPENURL', fn);
    },

    unableToOpenUrlEvent(isMailLink: boolean) {
        DeviceEventEmitter.emit('UNABLETOOPENURL', isMailLink);
    },

    genericErrorListener(fn: () => void) {
        return DeviceEventEmitter.addListener('GENERICERROR', fn);
    },

    genericErrorEvent() {
        DeviceEventEmitter.emit('GENERICERROR');
    },
    /**
     * This is only going to be used to listen for activityInitialized
     * within the React environment in order to do things like prevent or allow execution
     * of specific logic on a component level.
     * **/
    activityInitializedListener(fn: (isBeingInitialized: boolean) => void) {
        return DeviceEventEmitter.addListener('ACTIVITY_INITIALIZED', fn);
    },
    /**
     * This is only going to be used to emit event if the activity was initialized
     * from within the ActivityController class in order to notify the
     * React Native application, so it can use this information to do various things.
     * **/
    activityInitializedEvent(isBeingInitialized: boolean) {
        DeviceEventEmitter.emit('ACTIVITY_INITIALIZED', isBeingInitialized);
    },

    controllerStateChangeEvent(newControllerState: ActivityController | null) {
        DeviceEventEmitter.emit('CONTROLLER_STATE_CHANGED', newControllerState);
    },

    controllerStateChangeListener(fn: (newController: ActivityController) => void) {
        return DeviceEventEmitter.addListener('CONTROLLER_STATE_CHANGED', fn);
    },
};
