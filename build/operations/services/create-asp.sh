#!/bin/bash

: 'AZURE APP SERVICE PLAN
The Platform as a Service offering for Azure that is the container for hosting Web Apps, 
API Apps, Mobile Apps, and Function Apps. Think of this similar to an web farm of virtual
servers where you only have to manage the application framework and data.

Ref:
https://app.pluralsight.com/course-player?clipId=9b58df17-fdf9-4802-bbc4-40ea42a83655
'
# TODO's
# [] Setup and tear down (Elasticity) Auto Scaling https://docs.microsoft.com/azure/app-service-web/web-sites-scale

# Configure and set name
app_service_plan=$location_abbr-asp
[[ $debug == true ]] && echo "${bold}${green}App Service Plan"${reset}${unbold} && echo $app_service_plan

# Create
az appservice plan create --name $app_service_plan --resource-group $resource_group --location $location \
    --sku P3V2 \
    --only-show-errors \
    --is-linux

