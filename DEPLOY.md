# Deploying on a VPS (Contabo / any Ubuntu server)

The app runs as a normal Node.js server with a local SQLite database. No environment
variables are required.

## 1. One-time server setup (Ubuntu 22.04/24.04)

```bash
# Node.js 20 + build tools (needed to compile better-sqlite3)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential python3 git nginx
sudo npm install -g pm2
```

## 2. Get the code and start it

```bash
cd /var/www
git clone <your-repo-url> growth-b2b
cd growth-b2b
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # run the command it prints so the app starts after reboot
```

The site is now on `http://YOUR_SERVER_IP:3000`.

## 3. Admin login

On first start the database is created in `data/` and filled with the starting catalog.
An admin account is created with a **random password**:

```bash
cat /var/www/growth-b2b/data/admin-credentials.txt
```

Log in at `/admin/login`. Keep that file private (or delete it after saving the password).

## 4. Domain + HTTPS (recommended)

Point your domain's A record to the server IP, then:

```bash
sudo tee /etc/nginx/sites-available/growth-b2b > /dev/null <<'NGINX'
server {
    listen 80;
    server_name example.com www.example.com;
    client_max_body_size 30M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX
sudo ln -s /etc/nginx/sites-available/growth-b2b /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Replace `example.com` with your domain. After HTTPS works you can block direct
access to port 3000: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`.

## 5. Updating the site

```bash
cd /var/www/growth-b2b
git pull
npm ci
npm run build
pm2 restart growth-b2b
```

`data/` is never touched by updates.

## 6. Backups

Everything that changes lives in `data/`:

- `growth_b2b.db` – products, RFQs, BOM submissions, admin users, audit logs
- `uploads/` – uploaded logos and BOM files
- `.session-secret` – admin session signing key

Example nightly backup (add with `crontab -e`):

```
0 2 * * * tar czf /root/backup-growth-$(date +\%F).tar.gz -C /var/www/growth-b2b data
```

## Optional environment variables

None are required. If you want, create `.env.production`:

| Variable | Purpose |
| --- | --- |
| `ADMIN_EMAIL` | Email for the first admin account (default `admin@growthme.com`) |
| `ADMIN_PASSWORD` | Password for the first admin account (default: random, saved to `data/admin-credentials.txt`) |
| `ADMIN_JWT_SECRET` | Session signing key (default: random, saved to `data/.session-secret`) |
| `NEXT_PUBLIC_SITE_URL` | Your live domain for SEO links, sitemap and Google data (default `https://www.growthme.com`). Set it **before** `npm run build`. |

These only apply when the database / secret file is created for the first time.

## 7. Get found on Google (after the site is live on your domain)

1. Open https://search.google.com/search-console and add your domain.
2. Verify it (Google gives you a DNS TXT record to add at your domain provider).
3. In **Sitemaps**, submit `https://YOUR-DOMAIN/sitemap.xml`.
4. Create / claim a **Google Business Profile** for the Ajman HQ (and each hub if they have a real address) at https://business.google.com — this is what makes you appear on Google Maps for "insulation supplier Ajman / Dammam / Kuwait".

The site already sends Google your company details, the six GCC hub locations, and per-product data.
