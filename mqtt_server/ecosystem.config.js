module.exports = [
    {
        script: 'index.js',
        exec_mode: 'cluster',
        instances: 1,
        env: {
            STATUS: 'production',
        },
    },
];
