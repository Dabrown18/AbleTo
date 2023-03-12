const linking = {
    prefixes: ['https://ableto.com'],
    config: {
        screens: {
            Tabs: {
                screens: {
                    HomeTab: {
                        screens: {
                            Home: '/home',
                        },
                    },
                    ExploreTab: {
                        screens: {
                            Explore: '/explore',
                            Favorites: '/favorites',
                        },
                    },
                    FindCareTab: {
                        screens: {
                            FindCare: '/find-care',
                        },
                    },
                    SettingsTab: {
                        screens: {
                            Settings: '/settings',
                        },
                    },
                },
            },
        },
    },
};

export default linking;
