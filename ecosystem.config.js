module.exports = {
  apps: [
    {
      name: 'uniwear-api',
      script: 'server.js',
      cwd: '/var/www/uniwear/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/www/uniwear/logs/pm2-err.log',
      out_file: '/var/www/uniwear/logs/pm2-out.log',
      time: true
    }
  ]
};
