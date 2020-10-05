#!/bin/bash

: 'AZURE FAST PRODUCTION => DELETION
This will delete all resources within a region
'

# CONFIGURATION
    source ./config.sh

# LAUNCH
    setTitle "Delete Resources"

## DELETE Services
source $dir/services/delete-asp.sh & wait $!
source $dir/services/delete-rg.sh & wait $!
