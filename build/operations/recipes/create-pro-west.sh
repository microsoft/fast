#!/bin/bash

: 'AZURE FAST PRODUCTION => CREATION
This will create/configure all resources for Production in West Region
'
# TODO: Only thing that differs between east/west creation files is the location
# Create a command prompt to ask which region to create.  Then merge these two files

# GLOBAL Configurations
    source config.sh

    # Web Apps: valid subdomains to be created
    declare -a names=("app" "color" "create" "explore" "motion" "www")

    # Product: valid options {fast}
    product=fast

    # Subscription: valid options {production, development}
    subscription=production

    # Location: valid options {westus, eastus}
    location=westus && location_abbr=${location:0:4} 

    # Resource group: valid options {fast-westus-rg, fast-eastus-rg}
    resource_group=$product-$location-rg

    # App service plan
    app_service_plan=$location_abbr-asp

    # DNS Zone
    dns_zone=fast.design

## SHELL Arguments
source inputs.sh --debug true --product $product --subscription $subscription --location $location --resource-group $resource_group

# Create Active / Primary Region (West)
source $dir/services/create-rg.sh & wait $!
source $dir/services/create-asp.sh & wait $!
source $dir/services/create-app.sh & wait $!
