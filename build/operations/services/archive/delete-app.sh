#!/bin/bash

: 'AZURE WEB APP SERVICE
A fully managed compute platform that is optimized for hosting websites and web applications. 
Customers can use App Service on Linux to host web apps natively on Linux for supported 
application stacks.
'

# Configure
service_name="App Service"
service_code="app"
azure_log_analytics_location=southcentralus
azure_log_analytics_workspace_name=fast-ops-log
dns_zone="fast.design"

# Debugging
declare -a args=("$resource_group" "$service")
debugService args

# Azure CLI
for application in ${applications[@]}; do
    
    service=$application-$location-$service_code
    setService "Delete $service_name" "$service"

    title="deleting web app"
        printStatus "$title"
        {
            az webapp delete \
                --name $service \
                --resource-group $resource_group \
        } || {
            printStatus "Error: $title" "-e"
        }

done