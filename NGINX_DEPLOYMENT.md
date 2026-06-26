# Nginx Wildcard Subdomain & Custom Domain Routing Guide

This document outlines how to configure Nginx and your DNS server to support automatic dynamic subdomains (e.g. `pvolent.ntanda-lms.com`) and custom domains mapped to specific tenant portals (e.g. `elearning.university.edu`) for the Ntanda LMS SaaS platform.

---

## 1. DNS Configuration

### A. Wildcard Subdomains
To allow any organization to dynamically register and immediately access their subdomain, add a wildcard DNS record pointing to your server's public IP address:

| Record Type | Host | Points To / Value | TTL |
|---|---|---|---|
| `A` | `*` | `69.72.149.237` (Your Server IP) | Automatic / 3600 |
| `A` | `@` | `69.72.149.237` (Your Root Domain IP) | Automatic / 3600 |

### B. Custom Domains
When institutions connect a custom domain, ask their admin to configure a `CNAME` pointing to your platform's base domain:

| Record Type | Host | Points To / Value |
|---|---|---|
| `CNAME` | `elearning` (or `@`) | `ntanda-lms.com` |

---

## 2. Nginx Server Configuration

Create an Nginx configuration file (e.g., `/etc/nginx/sites-available/ntanda.conf`) with the following block to capture all subdomains and route custom domain aliases dynamically.

```nginx
# HTTP - Redirect all to HTTPS
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 301 https://$host$request_uri;
}

# HTTPS - Dynamic SaaS Portal Router
server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;

    # Matches any custom domains and wildcard subdomains
    server_name ~^(?<subdomain>.+)\.ntanda-lms\.com$ ~^(?<custom_domain>.+)$;

    # SSL Certs (Using Certbot Wildcard Certificates)
    ssl_certificate /etc/letsencrypt/live/ntanda-lms.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ntanda-lms.com/privkey.pem;

    # SSL Security Directives
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    
    # Static Assets & React Frontend Bundle Proxy
    location / {
        proxy_pass http://localhost:5173; # React SPA dev server or path to build directory (e.g., root /var/www/ntanda/frontend/dist)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Ensures client routing fallback (for React Router paths)
        try_files $uri $uri/ /index.html;
    }

    # API Backend Reverse Proxy
    location /api/v1/ {
        proxy_pass http://localhost:3001/api/v1/; # NestJS backend running port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Enforces passing down real client subdomains/domains to NestJS
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. SSL Configuration (Certbot Wildcard Let's Encrypt)

Run the following command to generate wildcard certificates using DNS challenges:

```bash
sudo certbot certonly --manual --preferred-challenges=dns -d "ntanda-lms.com" -d "*.ntanda-lms.com"
```

Once the TXT records are updated in your DNS registrar, verify and Nginx will load SSL successfully. Reload Nginx config:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
