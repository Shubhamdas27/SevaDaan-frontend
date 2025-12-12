#!/bin/sh

# Replace environment variables in built files
# This allows dynamic configuration without rebuilding

if [ -n "$VITE_API_URL" ]; then
    echo "Setting API URL to: $VITE_API_URL"
    find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_API_URL__|$VITE_API_URL|g" {} +
fi

if [ -n "$VITE_SOCKET_URL" ]; then
    echo "Setting Socket URL to: $VITE_SOCKET_URL"
    find /usr/share/nginx/html/assets -type f -name "*.js" -exec sed -i "s|__VITE_SOCKET_URL__|$VITE_SOCKET_URL|g" {} +
fi

# Start nginx
nginx -g 'daemon off;'
