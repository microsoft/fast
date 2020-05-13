#!/bin/bash
source config.sh

# CREATE RESOURCE GROUP
az group create --location $location --name $resource_group


# CREATE APP SERVICE PLAN
app_service_plan=$product_name-asp-$iteration
[[ $debug == true ]] && echo "${bold}${green}App Service Plan"${reset}${unbold}
[[ $debug == true ]] && echo $app_service_plan

az appservice plan create --name $app_service_plan --resource-group $resource_group --location $location \
    --sku P3V2 \
    --only-show-errors \
    --is-linux


# CREATE APP SERVICE
app_service=$product_name-as-$iteration
[[ $debug == true ]] && echo "${bold}${green}App Service"${reset}${unbold}
[[ $debug == true ]] && echo $app_service

<<COMMENT Find Linux runtimes
az webapp list-runtimes --linux
COMMENT

az webapp create --name $app_service --plan $app_service_plan --resource-group $resource_group \
    --runtime "NODE|12-lts"
#    --startup-file "pm2 start /home/site/wwwroot/server.js --no-daemon"

: 'CONFIGURE APP SERVICE
Ref:
https://docs.microsoft.com/en-us/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az-webapp-config-appsettings-set

Validate:
az webapp config appsettings list --name $app_service --resource-group $resource_group

Set:
az webapp config appsettings set \
     --name $app_service \
     --resource-group $resource_group \
     --settings key=value
'

## CONFIGURE BACKUP SNAPSHOTS
az webapp config snapshot create --resource-group $resource_group --webapp-name $app_service \
    --container-url 

: 'CONFIGURE LOGGING
Description: https://docs.microsoft.com/en-us/cli/azure/webapp/log?view=azure-cli-latest
'

az webapp log config --name $app_service\
    --application-logging true \
    --detailed-error-messages true \
    --docker-container-logging filesystem \
    --failed-request-tracing true \
    --level error \
    --resource-group $resource_group
    --web-server-logging filesystem


: 'Deploy code from a public GitHub repository. 
#az webapp up ... https://docs.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-up 

#az webapp deployment source config --name $app_service --resource-group $resource_group \
#--repo-url $gitrepo --branch master --manual-integration

# Copy the result of the following command into a browser to see the web app.
echo http://$app_service.azurewebsites.net

## Script Additions
# ?3. Turn FTP state to disabled
# 4. Enable Application Insights
# 6. Set HTTPS Only On
# 7. Set TLS/SSL Bindings: https://docs.microsoft.com/en-us/cli/azure/webapp/config/ssl?view=azure-cli-latest
# 8. Configure Azure Front Door 
# 9. Configure Azure CDN
# 10. Configure host name: https://docs.microsoft.com/en-us/cli/azure/webapp/config/hostname?view=azure-cli-latest#az-webapp-config-hostname-add

## Manual Follow Ups
# 1. How to install security agents in script on newly created VMs
# . Set Custom Domain
'