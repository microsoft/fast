#!/bin/bash

: 'AZURE FAST PRODUCTION => CREATION
This will create/configure all resources based on configuration
'

# CONFIGURATION
    source ./config.sh

# LAUNCH
    setTitle "Create Resources"

## SHELL Arguments
echo "$resource_group"
source inputs.sh --debug true --product $product --subscription $subscription --location $location --resource-group $resource_group

## CREATE Services
source $dir/services/create-rg.sh & wait $!
# source $dir/services/create-asp.sh & wait $!
# source $dir/services/create-app.sh & wait $!
