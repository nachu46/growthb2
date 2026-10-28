// PM2 process file for self-hosted deployment (see DEPLOY.md)
module.exports = {
  apps: [
    {
      name: 'growth-b2b',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: __dirname,
      env: { NODE_ENV: 'production' },
      max_memory_restart: '700M',
    },
  ],
};
