#!/bin/bash

: 'AZURE APP SERVICE PLAN

Ref:

'
# Configure and set name
app_service_plan=$location_abbr-asp
[[ $debug == true ]] && echo "${bold}${green}App Service Plan"${reset}${unbold} && echo $app_service_plan

# Create
az appservice plan create --name $app_service_plan --resource-group $resource_group --location $location \
    --sku P3V2 \
    --only-show-errors \
    --is-linux

# TODO's
# [] Setup Auto Scaling https://docs.microsoft.com/azure/app-service-web/web-sites-scale
