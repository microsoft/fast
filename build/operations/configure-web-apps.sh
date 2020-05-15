#!/bin/bash

# CONFIGURE WEB APP NAME PATTERN
web_app=$location_abbr-app
[[ $debug == true ]] && echo "${bold}${green}Web App Name Pattern"${reset}${unbold}
[[ $debug == true ]] && echo *-$web_app

# WEB APPS TO CREATE
declare -a names=("app" "color" "create" "explore" "motion" "www")

# TODO: DNS Updates https://prod.msftdomains.com/Dns/Requests
# ---------------------------------------------------
# Current       ->  Future
# ---------------------------------------------------
# fast-app      ->  app-west-app.azurewebsites.net
# fast-color    ->  color-west-app.azurewebsites.net
# fast-create   ->  create-west-app.azurewebsites.net
# fast-explore  ->  explore-west-app.azurewebsites.net
# fast-motion   ->  motion-west-app.azurewebsites.net
# fast-design   ->  www-west-app.azurewebsites.net
# ---------------------------------------------------
# TEST Procedures: 
# ---------------------------------------------------
# 1. Manually deploy initial sites w/ parity
# 2. Test all internal addresses as indicated by "future" above
# 3. Update DNS Records to point to all sites
# 4. Update Domain/Sub-Domain mapping for all sites
# 5. Setup Pipelines for automated deployment

# CREATE WEB APPS
for name in ${names[@]}; do
    
    # Build name
    new_name=$name-$web_app
    [[ $debug == true ]] && echo "${bold}${green}Web App Name"${reset}${unbold}
    [[ $debug == true ]] && echo $new_name

    # Create web app
    az webapp create --name $new_name --plan $app_service_plan --resource-group $resource_group --runtime "NODE|12-lts"

    # Configure web app
    az webapp config set --name $new_name \
        --always-on true \
        --auto-heal-enabled true \
        --ftps-state FtpsOnly \
        --http20-enabled true \
        --linux-fx-version "NODE|lts" \
        --min-tls-version "1.2" \
        --resource-group $resource_group \
        --subscription $subscription \
        --use-32bit-worker-process false
        #--startup-file "pm2 start /home/site/wwwroot/server.js --no-daemon"
        #--number-of-workers 4 \ # What is this and how many should be used?

    # Configure web app logs
    az webapp log config --name $new_name\
        --application-logging true \
        --detailed-error-messages true \
        --docker-container-logging filesystem \
        --failed-request-tracing true \
        --level error \
        --resource-group $resource_group \
        --web-server-logging filesystem

    #echo "Configure a CNAME record that maps $fqdn to $webappname.azurewebsites.net"
    #read -p "Press [Enter] key when ready ..."

    # TODO: https://docs.microsoft.com/en-us/azure/app-service/scripts/cli-configure-ssl-certificate 
    # Configure web app SSL binding
    az webapp config ssl import --key-vault /subscriptions/$subscription/resourceGroups/$resource_group/providers/Microsoft.KeyVault/vaults/fast-ops-kv --key-vault-certificate-name wildcard-fast-design-certificate \
        --resource-group $resource_group \
        --name $new_name
    
    az webapp config ssl bind --certificate-thumbprint E2AF1AB40BE8231661FA6C528A1173D2D9CE56F4 --ssl-type SNI \
        --resource-group $resource_group \
        --name $new_name
    
    # Configure web app hostname 
    # https://docs.microsoft.com/en-us/cli/azure/webapp/config/hostname?view=azure-cli-latest#az-webapp-config-hostname-add

    # Enable Application Insights
    # Set HTTPS Only On
    # Set TLS/SSL Bindings: https://docs.microsoft.com/en-us/cli/azure/webapp/config/ssl?view=azure-cli-latest

    # Secure Key Vaults https://docs.microsoft.com/en-us/azure/key-vault/general/network-security
    # https://docs.microsoft.com/en-us/azure/key-vault/general/overview-vnet-service-endpoints
    ## + New Virtual Network 
    ## https://docs.microsoft.com/en-us/azure/key-vault/general/manage-with-cli2

done


#Deploy code from a public GitHub repository. 
#az webapp up ... https://docs.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-up 

#az webapp deployment source config --name $web_app --resource-group $resource_group \
#--repo-url $gitrepo --branch master --manual-integration

# Copy the result of the following command into a browser to see the web app.
# echo http://$web_app.azurewebsites.net