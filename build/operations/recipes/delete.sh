#!/bin/bash

: 'DELETE FAST INFRASTRUCTURE
This will delete all resources within selected location
'

# CONFIGURATION
    source ./config.sh

# LAUNCH
    setTitle "Delete Resources"

## EXECUTE Services
    source $dir/services/delete-rg.sh

echo "${bold}${green}finished.${reset}"