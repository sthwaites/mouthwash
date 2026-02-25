#!/bin/sh

# Default to empty string if not set
OPENAI_API_KEY=${OPENAI_API_KEY:-""}

# Create/overwrite env-config.js in the web root
cat <<EOF > /usr/share/nginx/html/env-config.js
window.env = {
  OPENAI_API_KEY: "${OPENAI_API_KEY}"
};
EOF

# Execute the CMD from the Dockerfile (start nginx)
exec "$@"
