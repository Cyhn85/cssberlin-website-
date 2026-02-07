
conf = """server {
    listen 8081;
    listen [::]:8081;
    server_name _;

    root /var/www/cssberlin;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}"""

with open('/etc/nginx/sites-available/cssberlin', 'w') as f:
    f.write(conf)

print("Nginx config 'cssberlin' updated successfully.")

default_conf = """server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm;
    server_name _;

    # API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # CSS Berlin at /cssberlin path
    location /cssberlin/ {
        alias /var/www/cssberlin/;
        index index.html;
        try_files $uri $uri/ /cssberlin/index.html;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}"""

with open('/etc/nginx/sites-available/default', 'w') as f:
    f.write(default_conf)

print("Nginx config 'default' updated successfully.")
