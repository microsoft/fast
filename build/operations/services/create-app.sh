#!/bin/bash

: 'AZURE WEB APP SERVICE
A fully managed compute platform that is optimized for hosting websites and web applications. 
Customers can use App Service on Linux to host web apps natively on Linux for supported 
application stacks.

Ref:
https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-intro
'
# Configure and set name pattern
web_app=$location_abbr-app && [[ $debug == true ]] && echo "${bold}${green}Web App Name Pattern"${reset}${unbold} && echo *-$web_app
azure_log_analytics_location=southcentralus
azure_log_analytics_workspace_name=fast-ops-log

echo "creating web apps ..."
for name in ${names[@]}; do
    
    # Compose names
    echo "setting names ..."
        new_name=$name-$web_app && [[ $debug == true ]] && echo "${bold}${green}Web App Name"${reset}${unbold} && echo $new_name
        dns_cname=$new_name.azurewebsites.net && [[ $debug == true ]] && echo "${bold}${green}DNS CNAME"${reset}${unbold} && echo $dns_cname

    echo "creating web app [$new_name] ..."
        az webapp create --name $new_name --plan $app_service_plan --resource-group $resource_group --runtime "NODE|12-lts"

    echo "configuring web app ..."
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

    echo "configuring web app logs ..."
        az webapp log config --name $new_name\
            --application-logging true \
            --detailed-error-messages true \
            --docker-container-logging filesystem \
            --failed-request-tracing true \
            --level error \
            --resource-group $resource_group \
            --web-server-logging filesystem

    echo "creating slot for staging ..."
        az webapp deployment slot create --name $new_name -g $resource_group --slot stage

    echo "creating web app dns zone w/ cname record ..."
        az network dns record-set cname set-record --cname $dns_cname --record-set-name $name --resource-group fast-ops-rg --zone-name $dns_zone --if-none-match
    
    echo "configuring hostname ..."
        key_vault_id=$(az keyvault show --name fast-ops-kv --query "id" -o tsv)
        az webapp config hostname add --hostname $name.$dns_zone --resource-group $resource_group --webapp-name $new_name

    echo "importing ssl ..."
        az webapp config ssl import --key-vault $key_vault_id --key-vault-certificate-name wildcard-fast-design-certificate \
            --resource-group $resource_group \
            --name $new_name
    
    echo "binding ssl ..."
        az webapp config ssl bind --certificate-thumbprint E2AF1AB40BE8231661FA6C528A1173D2D9CE56F4 --ssl-type SNI \
            --resource-group $resource_group \
            --name $new_name

    echo "setting https only ..."
        az webapp update --https-only true --name $new_name --resource-group $resource_group
        
    echo "creating app insight ..."
        # TODO: It appears to be a bug in that we cannot place app insights into the same web app resource groups of westus or eastus.  So putting into fast-ops-rg (centralus) until
        # this feature in preview rolls out to all regions, then we can try again.
        web_app_insights_name=$new_name-appi

        az monitor app-insights component create --app $web_app_insights_name --location $azure_log_analytics_location --resource-group fast-ops-rg \
            --kind web \
            --application-type web \
            --workspace $azure_log_analytics_workspace_name

        web_app_insights_instrumentation_key=$(az monitor app-insights component show --app $web_app_insights_name -g fast-ops-rg --output tsv --query instrumentationKey)
        
    echo "configuring app insights [$web_app_insights_instrumentation_key] on web app ..." 
        az webapp config appsettings set --resource-group $resource_group --name $new_name \
            --settings APPINSIGHTS_INSTRUMENTATIONKEY="$web_app_insights_instrumentation_key" APPINSIGHTS_PROFILERFEATURE_VERSION="1.0.0" APPINSIGHTS_SNAPSHOTFEATURE_VERSION="1.0.0" APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$web_app_insights_instrumentation_key" ApplicationInsightsAgent_EXTENSION_VERSION="~2" DiagnosticServices_EXTENSION_VERSION="~3" InstrumentationEngine_EXTENSION_VERSION="~1" SnapshotDebugger_EXTENSION_VERSION="disabled" XDT_MicrosoftApplicationInsights_BaseExtensions="~1" XDT_MicrosoftApplicationInsights_Mode="recommended" WEBSITE_HTTPLOGGING_RETENTION_DAYS="7"

    echo "internal|external web sites: http://$new_name.azurewebsites.net => https://$name.$dns_zone"

done

echo "success !!!"