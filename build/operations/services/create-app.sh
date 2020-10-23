#!/bin/bash

: 'AZURE WEB APP SERVICE
A fully managed compute platform that is optimized for hosting websites and web applications. 
Customers can use App Service on Linux to host web apps natively on Linux for supported 
application stacks. This backend service is only accessible through the Front Door.
'

# Configure
service_type="App Service"
service_code="app"
dns_zone="fast.design"
operations_resource_group=$system-operations-rg

# Debugging
declare -a args=("$az_app_service_plan" "$az_resource_group")
debugService args

for application in ${applications[@]}; do
    
    service_name=$application-$location-$service_code
    setService "Create $service_type" "$service_name"
    dns_cname=$application.$dns_zone

    title="creating web app"
        printStatus "$title"
        {
            az webapp create \
                --name $service_name \
                --plan $az_app_service_plan \
                --resource-group $az_resource_group \
                --runtime "NODE|14-lts"

        } || {
            printStatus "Error: $title"
        }

    title="configuring web app"
        printStatus "$title"
        {
            az webapp config set \
                --name $service_name \
                --always-on true \
                --auto-heal-enabled true \
                --ftps-state Disabled \
                --http20-enabled true \
                --linux-fx-version "NODE|lts" \
                --min-tls-version "1.2" \
                --resource-group $az_resource_group \
                --subscription $subscription \
                --use-32bit-worker-process false \
                --startup-file "pm2 start /home/site/wwwroot/server.js --no-daemon"
        } || {
            printStatus "Error: $title" "-e"
        }
    
    title="configuring web app logs"
        printStatus "$title"
        {
            az webapp log config \
                --name $service_name \
                --application-logging true \
                --detailed-error-messages true \
                --docker-container-logging filesystem \
                --failed-request-tracing true \
                --level error \
                --resource-group $az_resource_group \
                --web-server-logging filesystem
        } || {
            printStatus "Error: $title" "-e"
        }

    title="configuring for https"
        printStatus "$title"
        {
            az webapp update \
                --https-only true \
                --name $service_name \
                --resource-group $az_resource_group
        } || {
            printStatus "Error: $title" "-e"
        }
    
    title="creating slot for staging"
        printStatus "$title"
        {
            az webapp deployment slot create \
                --name $service_name \
                --resource-group $az_resource_group \
                --slot stage
        } || {
            printStatus "Error: $title" "-e"
        }

    title="configuring network access to staging for IPv4 restrictions"
        printStatus "$title"
        {
            az webapp config access-restriction add --priority 100 \
                --resource-group $az_resource_group \
                --name $service_name \
                --slot stage \
                --description "Deny access to all except Front Door" \
                --rule-name "Front Door IPv4" \
                --action Allow \
                --ip-address 147.243.0.0/16
        } || {
            printStatus "Error: $title" "-e"
        }
    
    title="configuring network access to staging for IPv6 restrictions"
        printStatus "$title"
        {
            az webapp config access-restriction add --priority 200 \
                --resource-group $az_resource_group \
                --name $service_name \
                --slot stage \
                --description "Deny access to all except Front Door" \
                --rule-name "Front Door IPv6" \
                --action Allow \
                --ip-address 2a01:111:2050::/44
        } || {
            printStatus "Error: $title" "-e"
        }

    title="create/configure dns zone and cname records"
        printStatus "$title"
        {
            # Prerequisites
            az group create \
                --location "centralus" \
                --name $operations_resource_group

            az network dns zone create --name $dns_zone \
                --resource-group=$operations_resource_group \
                --if-none-match
            
            az network dns record-set cname set-record --cname $application \
                --record-set-name $application \
                --resource-group $operations_resource_group \
                --zone-name $dns_zone \
                --if-none-match

        } || {
            printStatus "Error: $title" "-e"
        } 

    echo "internal|external production sites: http://$service_name.azurewebsites.net => https://$dns_cname.$dns_zone"
    echo "internal staging site: http://$service_name-stage.azurewebsites.net"

done