#!/bin/bash

: 'AZURE FAST PRODUCTION => DELETION
This will delete all resources for Production in West Region
'
# TODO: Only thing that differs between east/west creation files is the location
# Create a command prompt to ask which region to create.  Then merge these two files

# GLOBAL Configurations
    source config.sh

    # Web Apps: valid subdomains to be created
    # declare -a names=("app" "color" "create" "explore" "motion" "www")
    declare -a names=("app")

    # Product: valid options {fast}
    product=fast

    # Subscription: valid options {production, development}
    subscription=production

    # Location: valid options {westus, eastus}
    location=westus && location_abbr=${location:0:4} 

    # Resource group: valid options {fast-westus-rg, fast-eastus-rg}
    resource_group=$product-$location-rg
  
    # DNS Zone
    dns_zone=fast.design

## SHELL Arguments
source inputs.sh --debug true --subscription $subscription --location $location --resource-group $resource_group

# DELETE CNAME record
for name in ${names[@]}; do
    
    # Compose names
    dns_cname=$name.$dns_zone
    web_app_name=$name-$location_abbr-app
    
    echo "deleting cnames for [$name] ..."
    az network dns record-set cname remove-record --resource-group "fast-ops-rg" --zone-name $dns_zone --record-set-name $name --cname $dns_cname

done

# DELETE Resource group and all child services
az group delete --name $resource_group