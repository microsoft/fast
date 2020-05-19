#!/bin/bash

: 'AZURE WEB APP SERVICE

Ref:

'
# Configure and set name pattern
web_app=$location_abbr-app
[[ $debug == true ]] && echo "${bold}${green}Web App Name Pattern"${reset}${unbold} && echo *-$web_app

# Create
for name in ${names[@]}; do
    
    # Compose names
    new_name=$name-$web_app && [[ $debug == true ]] && echo "${bold}${green}Web App Name"${reset}${unbold} && echo $new_name
    dns_cname=$new_name.azurewebsites.net && [[ $debug == true ]] && echo "${bold}${green}DNS CNAME"${reset}${unbold} && echo $dns_cname

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

    # Set DNS zone w/ cname record
    # az network dns record-set cname set-record -c fast-app.azurewebsites.net -n app -g fast-ops-rg -z fast.design --if-none-match
    az network dns record-set cname set-record --cname $dns_cname --record-set-name $name --resource-group fast-ops-rg --zone-name $dns_zone --if-none-match

    # TODO: https://docs.microsoft.com/en-us/azure/app-service/scripts/cli-configure-ssl-certificate 
    # Configure web app SSL binding
    key_vault_id=$(az keyvault show --name fast-ops-kv --query "id" -o tsv)

    echo "ssl importing ..."
    az webapp config ssl import --key-vault $key_vault_id --key-vault-certificate-name wildcard-fast-design-certificate \
        --resource-group $resource_group \
        --name $new_name
    
    echo "ssl binding ..."
    az webapp config ssl bind --certificate-thumbprint E2AF1AB40BE8231661FA6C528A1173D2D9CE56F4 --ssl-type SNI \
        --resource-group $resource_group \
        --name $new_name
    
    # Bind custom hostname
    echo "configuring hostname ..."
    az webapp config hostname add --hostname $name.$dns_zone --resource-group fast-ops-rg --webapp-name $new_name

    # Configure web app hostname 
    # https://docs.microsoft.com/en-us/cli/azure/webapp/config/hostname?view=azure-cli-latest#az-webapp-config-hostname-add

    # Enable Application Insights
    # Set HTTPS Only On
    # Set TLS/SSL Bindings: https://docs.microsoft.com/en-us/cli/azure/webapp/config/ssl?view=azure-cli-latest


    ## + New Virtual Network 
    ## https://docs.microsoft.com/en-us/azure/key-vault/general/manage-with-cli2

done


#Deploy code from a public GitHub repository. 
#az webapp up ... https://docs.microsoft.com/en-us/cli/azure/webapp?view=azure-cli-latest#az-webapp-up 

#az webapp deployment source config --name $web_app --resource-group $resource_group \
#--repo-url $gitrepo --branch master --manual-integration

# Copy the result of the following command into a browser to see the web app.
# echo http://$web_app.azurewebsites.net