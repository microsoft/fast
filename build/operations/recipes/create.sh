#!/bin/bash

: 'CREATE FAST INFRASTRUCTURE
This will create/configure all resources based on configuration
'

# CONFIGURATION
    source ./config.sh

# LAUNCH
    setTitle "Creating Azure Services"

## EXECUTE Services
    source $dir/services/create-rg.sh
    source $dir/services/create-log.sh
    source $dir/services/create-asp.sh
    source $dir/services/create-app.sh
    source $dir/services/create-appi.sh