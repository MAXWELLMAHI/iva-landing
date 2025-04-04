# Deployment Guide for IVA Donation Platform

This guide provides instructions for deploying the IVA Donation Platform to a production environment securely.

## Prerequisites

- Node.js (v18+)
- MySQL or compatible database
- SSL/TLS certificate (Let's Encrypt recommended)
- Domain name
- Web server (Nginx recommended)

## Environment Setup

1. Set up proper environment variables in a production `.env` file:

```
# Database Configuration - Use strong passwords for production!
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=strong-production-password
DB_NAME=your-production-db-name
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=generate-a-secure-random-string-here
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=warn

# Frontend URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Database Setup

1. Create the database:

```sql
CREATE DATABASE your_production_db_name;
CREATE USER 'your_production_db_user'@'%' IDENTIFIED BY 'strong-production-password';
GRANT ALL PRIVILEGES ON your_production_db_name.* TO 'your_production_db_user'@'%';
FLUSH PRIVILEGES;
```

2. The server will automatically create the required tables on first startup.

## SSL/TLS Setup

### Using Let's Encrypt with Certbot

1. Install Certbot:

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

2. Obtain a certificate:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

3. Set up auto-renewal:

```bash
sudo systemctl status certbot.timer
```

### Nginx Configuration

Create an Nginx configuration file for your domain:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect all HTTP requests to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
    
    # Improve SSL security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Frontend configuration
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API configuration
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Compression
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        application/javascript
        application/json
        application/x-javascript
        application/xml
        text/css
        text/javascript
        text/plain
        text/xml;
}
```

## Application Deployment

### Build the Next.js Application

1. Install dependencies:

```bash
npm ci --production
```

2. Build the Next.js application:

```bash
npm run build
```

### Process Manager (PM2)

1. Install PM2 globally:

```bash
npm install -g pm2
```

2. Create an ecosystem.config.js file:

```js
module.exports = {
  apps: [
    {
      name: 'iva-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/donation-platform',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'iva-backend',
      script: 'server/server.js',
      cwd: '/path/to/donation-platform',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

3. Start the application:

```bash
pm2 start ecosystem.config.js
```

4. Set up PM2 to start on boot:

```bash
pm2 startup
pm2 save
```

## Monitoring and Logging

### Application Logs

- Check frontend logs:
```bash
pm2 logs iva-frontend
```

- Check backend logs:
```bash
pm2 logs iva-backend
```

- Application logs are stored in the `server/logs` directory.

### Server Monitoring

Consider setting up:

1. **Server Monitoring**: Set up services like New Relic, Datadog, or Prometheus with Grafana.
2. **Error Tracking**: Use Sentry to track frontend and backend errors.
3. **Performance Monitoring**: Use tools like Lighthouse CI to monitor website performance.

## Scaling Considerations

For handling thousands of users:

1. **Database**: Set up proper indexes and consider read replicas for heavy traffic.
2. **Caching**: Implement Redis for session storage and frequent database queries.
3. **CDN**: Use a CDN like Cloudflare to cache static assets.
4. **Load Balancing**: Set up multiple instances behind a load balancer for horizontal scaling.

## Backup Strategy

1. **Database Backups**: Set up daily automated backups of your database.
   ```bash
   # Example with mysqldump
   mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
   ```

2. **Application Backups**: Regularly back up your application code and configuration.

## Security Considerations

1. **Regular Updates**: Keep all dependencies updated with security patches.
   ```bash
   npm audit fix
   ```

2. **Penetration Testing**: Consider regular security audits and penetration testing.

3. **Firewall**: Configure your server firewall to only allow necessary connections.

4. **Rate Limiting**: The application already has rate limiting configured, monitor and adjust as needed.

## Conclusion

Following these steps will help ensure your donation platform is securely deployed and ready to handle thousands of users. Always keep your server, application, and dependencies updated to address security vulnerabilities. 