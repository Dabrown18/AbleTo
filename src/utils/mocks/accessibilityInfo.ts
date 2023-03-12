// @todo: mock the other properties as needed
export const mockAddEventListener = () => {
    return {
        // The mock for remove is needed in places where
        // we have a subscription to it (e.g. `useScreenReader`)
        // that we eventually want to unsubscribe from.
        // By default the mock for `remove` is just `undefined`.
        remove: () => {},
    };
};
