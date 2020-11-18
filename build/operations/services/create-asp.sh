#!/bin/bash

: 'AZURE APP SERVICE PLAN
The Platform as a Service offering for Azure that is the container for hosting Web Apps, 
API Apps, Mobile Apps, and Function Apps. Think of this similar to an web farm of virtual
servers where you only have to manage the application framework and data.
'

# Configure
service_type="App Service Plan"
service_code="asp"
service_name=$location-$service_code

setService "Create $service_type" "$service_name"

# Debugging
declare -a args=("$resource_group" "$service_name" "$location")
debugService args

# EXECUTE services
title="creating app service plan"
    printStatus "$title"
    {
        az appservice plan create \
            --name $service_name \
            --resource-group $resource_group \
            --location $location \
            --sku P3V2 \
            --only-show-errors \
            --is-linux

    } || {
        printStatus "Error: $title"
    }

# In this instance the plan id is required not plan name ref: https://github.com/Azure/azure-cli/issues/6545#issuecomment-712940827
export az_app_service_plan=$(az appservice plan show --name $service_name --resource-group $resource_group --query "id" -o tsv)