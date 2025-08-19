# Ghid de Deployment - Vali Events Platform

## 🚀 Deployment în Producție

### 1. Pregătirea pentru Producție

#### Actualizare variabile de mediu
Creează un fișier `.env.production`:

```env
NODE_ENV=production
PORT=80
JWT_SECRET=your_super_secure_jwt_secret_key_here
DB_PATH=./server/database/events.db

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Revolut API Configuration
REVOLUT_API_KEY=your_revolut_api_key
REVOLUT_MERCHANT_ID=your_merchant_id
REVOLUT_WEBHOOK_SECRET=your_webhook_secret
REVOLUT_PAYMENT_URL=https://merchant.revolut.com/embed.js

# Security
CORS_ORIGIN=https://your-domain.com
```

#### Build aplicația React
```bash
cd client
npm run build
```

### 2. Deployment pe VPS/Server

#### Instalare dependențe pe server
```bash
# Instalează Node.js (versiunea LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalează PM2 pentru process management
sudo npm install -g pm2

# Clonează repository-ul
git clone <your-repository-url>
cd vali-events-platform

# Instalează dependențele
npm run install-all
```

#### Configurare PM2
Creează fișierul `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'vali-events',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

#### Pornește aplicația cu PM2
```bash
# Creează directorul pentru log-uri
mkdir logs

# Populează baza de date cu date de test (opțional)
npm run seed

# Pornește aplicația în modul producție
pm2 start ecosystem.config.js --env production

# Salvează configurația PM2
pm2 save

# Configurează PM2 să pornească automat la restart
pm2 startup
```

### 3. Configurare Nginx (Reverse Proxy)

#### Instalare Nginx
```bash
sudo apt update
sudo apt install nginx
```

#### Configurare site
Creează fișierul `/etc/nginx/sites-available/vali-events`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Servește fișierele statice React
    location / {
        root /path/to/vali-events-platform/client/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy pentru API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Servește fișierele încărcate
    location /uploads/ {
        root /path/to/vali-events-platform/server;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Securitate headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

#### Activează site-ul
```bash
# Creează link simbolic
sudo ln -s /etc/nginx/sites-available/vali-events /etc/nginx/sites-enabled/

# Testează configurația
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 4. SSL cu Let's Encrypt (Opțional dar Recomandat)

```bash
# Instalează Certbot
sudo apt install certbot python3-certbot-nginx

# Obține certificatul SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Testează renewal automat
sudo certbot renew --dry-run
```

### 5. Configurare Firewall

```bash
# Configurează UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 🐳 Deployment cu Docker

### Dockerfile pentru Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY server/ ./server/
COPY .env ./

EXPOSE 5000

CMD ["node", "server/index.js"]
```

### Dockerfile pentru Frontend
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./server/database:/app/server/database
      - ./server/uploads:/app/server/uploads

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - frontend
      - backend
```

## 📊 Monitorizare și Backup

### Monitorizare cu PM2
```bash
# Monitorizează aplicația
pm2 monit

# Vezi log-urile
pm2 logs vali-events

# Restart aplicația
pm2 restart vali-events
```

### Backup Baza de Date
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DB_PATH="/path/to/vali-events-platform/server/database/events.db"

# Creează backup
cp $DB_PATH "$BACKUP_DIR/events_backup_$DATE.db"

# Păstrează doar ultimele 30 de backup-uri
find $BACKUP_DIR -name "events_backup_*.db" -type f -mtime +30 -delete

echo "Backup creat: events_backup_$DATE.db"
```

### Configurare Cron pentru Backup Automat
```bash
# Editează crontab
crontab -e

# Adaugă linia pentru backup zilnic la 2 AM
0 2 * * * /path/to/backup-db.sh
```

## 🔧 Troubleshooting

### Probleme Comune

1. **Aplicația nu pornește**
   - Verifică log-urile: `pm2 logs`
   - Verifică porturile: `netstat -tlnp`
   - Verifică variabilele de mediu

2. **Probleme cu baza de date**
   - Verifică permisiunile fișierului SQLite
   - Rulează din nou `npm run seed` pentru date de test

3. **Probleme cu upload-ul de fișiere**
   - Verifică permisiunile directorului `server/uploads`
   - Verifică configurația Nginx pentru fișiere statice

4. **Probleme cu email-urile**
   - Verifică configurația SMTP
   - Pentru Gmail, folosește App Passwords

### Comenzi Utile

```bash
# Verifică statusul aplicației
pm2 status

# Restart aplicația
pm2 restart vali-events

# Verifică log-urile Nginx
sudo tail -f /var/log/nginx/error.log

# Verifică utilizarea resurselor
htop
df -h
free -h

# Backup manual al bazei de date
cp server/database/events.db backup_$(date +%Y%m%d).db
```

## 📈 Optimizări pentru Producție

1. **Compresie Gzip**: Activată în configurația Nginx
2. **Cache pentru fișiere statice**: Configurate în Nginx
3. **Cluster mode**: PM2 rulează în modul cluster
4. **Rate limiting**: Implementat în aplicație
5. **Security headers**: Adăugate în Nginx

## 🔐 Securitate

1. **Actualizează regulat dependențele**: `npm audit fix`
2. **Folosește HTTPS**: Certificat SSL cu Let's Encrypt
3. **Configurează firewall**: UFW sau iptables
4. **Monitorizează log-urile**: Pentru activități suspecte
5. **Backup regulat**: Automatizat cu cron jobs

---

Pentru suport suplimentar sau întrebări despre deployment, contactează echipa de dezvoltare.