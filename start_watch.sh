NODE_ENV=production forever start -l forever.log -o out.log -e err.log -a -w --watchDirectory $(pwd)/config/env server.js
