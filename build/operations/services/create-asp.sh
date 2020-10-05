#!/bin/bash

: 'AZURE APP SERVICE PLAN
The Platform as a Service offering for Azure that is the container for hosting Web Apps, 
API Apps, Mobile Apps, and Function Apps. Think of this similar to an web farm of virtual
servers where you only have to manage the application framework and data.

Ref:
https://app.pluralsight.com/course-player?clipId=9b58df17-fdf9-4802-bbc4-40ea42a83655
'

# Configure
service_name="App Service Plan"
service_code="asp"
service=$location-$service_code

setService "Create $service_name" "$service"

# Debugging
declare -a args=("$resource_group" "$service" "$location")
debugService args

# Azure CLI
az appservice plan create \
    --name $service \
    --resource-group $resource_group \
    --location $location \
    --sku P3V2 \
    --only-show-errors \
    --is-linux