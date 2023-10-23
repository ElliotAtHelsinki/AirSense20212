module.exports = [
	{
		script: 'server.js',
		exec_mode: 'cluster',
		// instances: -1,
		instances: 1,
		env: {
			STATUS: 'production',
		},
		max_memory_restart: '500M',
	},
];
