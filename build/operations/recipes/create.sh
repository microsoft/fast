#!/bin/bash

: 'AZURE FAST PRODUCTION => CREATION
This will create/configure all resources based on configuration
'

# CONFIGURATION
    source ./config.sh

# LAUNCH
    setTitle "Creating Azure Services"
  
## CREATE Services
source $dir/services/create-rg.sh
source $dir/services/create-asp.sh
source $dir/services/create-app.sh

