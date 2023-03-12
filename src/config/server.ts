export type ServerConfiguration = {
    name: Environment;
    baseUrl: string;
    apiUrl: string;
    ableToApiUrl: string;
};

export type Environment = 'production' | 'dev' | 'dev2' | 'staging' | 'sit' | 'uat' | 'local' | 'local_emulator';

type ServerConfigs = {
    [key in Environment]: ServerConfiguration;
};

export const serverConfigs: ServerConfigs = {
    production: {
        name: 'production',
        baseUrl: 'https://app.ableto.com',
        apiUrl: 'https://app.ableto.com/api/v1',
        ableToApiUrl: 'https://api.ableto.com',
    },
    dev: {
        name: 'dev',
        baseUrl: 'https://consumer.dev.ableto.com',
        apiUrl: 'https://consumer.dev.ableto.com/api/v1',
        ableToApiUrl: 'https://api.dev.ableto.com',
    },
    dev2: {
        name: 'dev2',
        baseUrl: 'https://consumer2.dev.ableto.com',
        apiUrl: 'https://consumer2.dev.ableto.com/api/v1',
        ableToApiUrl: 'https://api.dev.ableto.com',
    },
    sit: {
        name: 'sit',
        baseUrl: 'https://consumer.sit.ableto.com',
        apiUrl: 'https://consumer.sit.ableto.com/api/v1',
        ableToApiUrl: 'https://api.sit.ableto.com',
    },
    staging: {
        name: 'staging',
        baseUrl: 'https://consumer.stg.ableto.com',
        apiUrl: 'https://consumer.stg.ableto.com/api/v1',
        ableToApiUrl: 'https://api.dev.ableto.com',
    },
    uat: {
        name: 'uat',
        baseUrl: 'https://consumer.uat.ableto.com',
        apiUrl: 'https://consumer.uat.ableto.com/api/v1',
        ableToApiUrl: 'https://api.uat.ableto.com',
    },
    local: {
        name: 'local',
        baseUrl: 'http://localhost:5000',
        apiUrl: 'http://localhost:5000/api/v1',
        ableToApiUrl: 'https://api.dev.ableto.com',
    },
    local_emulator: {
        name: 'local_emulator',
        baseUrl: 'http://10.0.2.2:5000',
        apiUrl: 'http://10.0.2.2:5000/api/v1',
        ableToApiUrl: 'https://api.dev.ableto.com',
    },
};

export const getServerConfig = (apiUrl: string) =>
    Object.values(serverConfigs).find((conf) => conf.apiUrl === apiUrl)!!;

/**
 * Verify that the passed in config object contains all required properties
 * by the ServerConfiguration type. Used when adding new values to the type
 * to reset the stored configuration value (PERSISTED_SERVER_KEY).
 * @param config any
 * @returns boolean
 */
export const isServerConfiguration = (config: any): config is ServerConfiguration => {
    const serverConfig = config as ServerConfiguration;
    return !!(serverConfig.name && serverConfig.baseUrl && serverConfig.apiUrl && serverConfig.ableToApiUrl);
};

export default serverConfigs;
