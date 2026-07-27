export const config: WebdriverIO.Config & {
    autoCompileOpts?: {
        autoCompile?: boolean;
        tsNodeOpts?: {
            transpileOnly?: boolean;
            project?: string;
        };
    };
} = {
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json'
        }
    },
    specs: [
        './test/**/*.spec.ts'
    ],
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['--disable-gpu', '--window-size=1920,1080']
        }
    }],
    logLevel: 'error',
    bail: 0,
    baseUrl: 'https://www.cheapflights.com.au',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};