#!/bin/bash

# RoboLab Production Deployment Script
# This script sets up a production-ready deployment with load balancing and session management

set -e

echo "🚀 Starting RoboLab Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NODE_VERSION="18"
PM2_APP_NAME="robolab-backend"
NGINX_CONFIG_PATH="/etc/nginx/sites-available/robolab"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/robolab"
APP_DIR="/var/www/robolab"
SERVICE_USER="robolab"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root for security reasons"
        exit 1
    fi
}

# Install Node.js
install_nodejs() {
    log_info "Installing Node.js $NODE_VERSION..."
    
    if command -v node &> /dev/null; then
        CURRENT_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$CURRENT_VERSION" -ge "$NODE_VERSION" ]; then
            log_success "Node.js $CURRENT_VERSION is already installed"
            return
        fi
    fi
    
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    log_success "Node.js installed successfully"
}

# Install PM2
install_pm2() {
    log_info "Installing PM2..."
    
    if command -v pm2 &> /dev/null; then
        log_success "PM2 is already installed"
        return
    fi
    
    sudo npm install -g pm2
    pm2 startup | grep -E '^sudo' | bash
    
    log_success "PM2 installed successfully"
}

# Install Redis
install_redis() {
    log_info "Installing Redis..."
    
    if command -v redis-server &> /dev/null; then
        log_success "Redis is already installed"
        return
    fi
    
    sudo apt-get update
    sudo apt-get install -y redis-server
    
    # Configure Redis
    sudo sed -i 's/^# maxmemory <bytes>/maxmemory 256mb/' /etc/redis/redis.conf
    sudo sed -i 's/^# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
    
    sudo systemctl enable redis-server
    sudo systemctl start redis-server
    
    log_success "Redis installed and configured"
}

# Install Nginx
install_nginx() {
    log_info "Installing Nginx..."
    
    if command -v nginx &> /dev/null; then
        log_success "Nginx is already installed"
        return
    fi
    
    sudo apt-get update
    sudo apt-get install -y nginx
    
    sudo systemctl enable nginx
    sudo systemctl start nginx
    
    log_success "Nginx installed successfully"
}

# Install Certbot for SSL
install_certbot() {
    log_info "Installing Certbot for SSL..."
    
    if command -v certbot &> /dev/null; then
        log_success "Certbot is already installed"
        return
    fi
    
    sudo apt-get install -y certbot python3-certbot-nginx
    
    log_success "Certbot installed successfully"
}

# Create application user
create_app_user() {
    log_info "Creating application user..."
    
    if id "$SERVICE_USER" &>/dev/null; then
        log_success "User $SERVICE_USER already exists"
        return
    fi
    
    sudo useradd -r -s /bin/false -d $APP_DIR $SERVICE_USER
    sudo mkdir -p $APP_DIR
    sudo chown $SERVICE_USER:$SERVICE_USER $APP_DIR
    
    log_success "Application user created"
}

# Setup application directory
setup_app_directory() {
    log_info "Setting up application directory..."
    
    # Copy application files
    sudo cp -r . $APP_DIR/
    sudo chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR
    
    # Install dependencies
    cd $APP_DIR
    sudo -u $SERVICE_USER npm install --production
    
    # Build application
    sudo -u $SERVICE_USER npm run build
    
    log_success "Application directory setup complete"
}

# Configure PM2
configure_pm2() {
    log_info "Configuring PM2..."
    
    # Create PM2 ecosystem file
    cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/robolab-error.log',
    out_file: '/var/log/pm2/robolab-out.log',
    log_file: '/var/log/pm2/robolab-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF
    
    # Create log directory
    sudo mkdir -p /var/log/pm2
    sudo chown $SERVICE_USER:$SERVICE_USER /var/log/pm2
    
    log_success "PM2 configuration complete"
}

# Configure Nginx
configure_nginx() {
    log_info "Configuring Nginx..."
    
    # Create Nginx configuration
    sudo tee $NGINX_CONFIG_PATH > /dev/null << EOF
upstream robolab_backend {
    least_conn;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3004 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss:; frame-ancestors 'self';" always;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://robolab_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://robolab_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Health check
    location /health {
        proxy_pass http://robolab_backend;
        access_log off;
    }
    
    # Static files (if serving frontend from same server)
    location / {
        root /var/www/robolab-frontend;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF
    
    # Enable site
    sudo ln -sf $NGINX_CONFIG_PATH $NGINX_ENABLED_PATH
    sudo nginx -t
    sudo systemctl reload nginx
    
    log_success "Nginx configuration complete"
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    if [ -z "$DOMAIN" ]; then
        log_warning "No domain specified. Skipping SSL setup."
        return
    fi
    
    log_info "Setting up SSL for domain: $DOMAIN"
    
    # Update Nginx config with domain
    sudo sed -i "s/server_name _;/server_name $DOMAIN;/" $NGINX_CONFIG_PATH
    sudo nginx -t
    sudo systemctl reload nginx
    
    # Get SSL certificate
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    log_success "SSL setup complete"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Install htop for monitoring
    sudo apt-get install -y htop
    
    # Create monitoring script
    cat > $APP_DIR/monitor.sh << 'EOF'
#!/bin/bash

# Monitor script for RoboLab
echo "=== RoboLab System Status ==="
echo "Date: $(date)"
echo ""

echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Memory Usage ==="
free -h

echo ""
echo "=== Disk Usage ==="
df -h

echo ""
echo "=== Redis Status ==="
systemctl is-active redis-server

echo ""
echo "=== Nginx Status ==="
systemctl is-active nginx

echo ""
echo "=== Application Logs (last 10 lines) ==="
pm2 logs robolab-backend --lines 10
EOF
    
    chmod +x $APP_DIR/monitor.sh
    
    log_success "Monitoring setup complete"
}

# Start application
start_application() {
    log_info "Starting application..."
    
    cd $APP_DIR
    sudo -u $SERVICE_USER pm2 start ecosystem.config.js --env production
    sudo -u $SERVICE_USER pm2 save
    
    # Wait for application to start
    sleep 5
    
    # Check if application is running
    if pm2 list | grep -q "$PM2_APP_NAME.*online"; then
        log_success "Application started successfully"
    else
        log_error "Failed to start application"
        pm2 logs $PM2_APP_NAME
        exit 1
    fi
}

# Setup log rotation
setup_log_rotation() {
    log_info "Setting up log rotation..."
    
    sudo tee /etc/logrotate.d/robolab > /dev/null << EOF
/var/log/pm2/robolab-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $SERVICE_USER $SERVICE_USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
    
    log_success "Log rotation configured"
}

# Main deployment function
main() {
    log_info "Starting RoboLab production deployment..."
    
    # Check if running as root
    check_root
    
    # Install dependencies
    install_nodejs
    install_pm2
    install_redis
    install_nginx
    install_certbot
    
    # Setup application
    create_app_user
    setup_app_directory
    configure_pm2
    configure_nginx
    
    # Setup SSL if domain provided
    if [ ! -z "$DOMAIN" ]; then
        setup_ssl
    fi
    
    # Setup monitoring and logging
    setup_monitoring
    setup_log_rotation
    
    # Start application
    start_application
    
    log_success "🎉 RoboLab production deployment complete!"
    log_info "Application is running on port 3001"
    log_info "Nginx is configured for load balancing"
    log_info "Redis is running for session management"
    log_info "PM2 is managing the application processes"
    
    if [ ! -z "$DOMAIN" ]; then
        log_info "SSL is configured for domain: $DOMAIN"
        log_info "Access your application at: https://$DOMAIN"
    else
        log_info "Access your application at: http://your-server-ip"
    fi
    
    log_info "Monitor your application with: pm2 monit"
    log_info "View logs with: pm2 logs $PM2_APP_NAME"
    log_info "Run monitoring script: $APP_DIR/monitor.sh"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [--domain your-domain.com]"
            echo "  --domain    Set domain for SSL certificate"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main
