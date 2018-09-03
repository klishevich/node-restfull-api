const environments = {};

// development environment (default)
environments.development = {
    port: 3000,
    envName: 'development'
};

environments.production = {
    port: 5000,
    envName: 'production'
};

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.development;

module.exports = environmentToExport;
