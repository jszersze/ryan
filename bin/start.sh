#!/bin/bash

#
# colors
#

PURPLE='\033[0;35m'
NC='\033[0m'

printf "\n  ${PURPLE}ryan: starting - main server in production${NC}\n\n"

# mongod --config /usr/local/etc/mongod.conf

exec node ./api/index.js prod . >> ./ryan.log 2>&1 &
nohup echo '';