#!/bin/bash

: 'AZURE FAST PRODUCTION => DELETION
This will delete all resources for Production in West Region
'
# TODO: Only thing that differs between east/west creation files is the location
# Create a command prompt to ask which region to create.  Then merge these two files

# GLOBAL Configurations
    source config.sh

    # Product: valid options {fast}
    product=fast

    # Subscription: valid options {production, development}
    subscription=production

    # Location: valid options {westus, eastus}
    location=eastus && location_abbr=${location:0:4} 

    # Resource group: valid options {fast-westus-rg, fast-eastus-rg}
    resource_group=$product-$location-rg


## SHELL Arguments
source inputs.sh --debug true --subscription $subscription --location $location --resource-group $resource_group

# DELETE Resource group and all child services
az group delete --name $resource_group

#TODO: delete cname record