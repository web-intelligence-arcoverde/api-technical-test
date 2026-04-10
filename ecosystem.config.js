module.exports = {
	apps: [
		{
			name: "shopping-list-api",
			script: "./dist/app.js",
			instances: 2,
			exec_mode: "cluster",
			max_memory_restart: "500M",
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
