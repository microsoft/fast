#!/bin/bash

: 'AZURE WEB APP SERVICE
A fully managed compute platform that is optimized for hosting websites and web applications. 
Customers can use App Service on Linux to host web apps natively on Linux for supported 
application stacks.

Note: This backend service is only accessible through the Front Door.

Ref:
https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-intro

'
# TODO's
# [] Configure diagnostics for all apps https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/07b166d9-9849-4c8e-8df4-3f039daf5a05/resourceGroups/fast-eastus-rg/providers/Microsoft.Web/sites/www-east-app/diagnosticsLogs
# [] Configure logs with "www-east-app-log" as the name and sent everything to Log Analytics
# [] Submit contribution for https://github.com/MicrosoftDocs/azure-docs/issues/36141
# [] Turn off ARR Affinity on all servers/slots
# [] Set --number-of-workers
# [] Archive logs in their own storage container


# Configure
service_name="App Service"
service_code="app"
azure_log_analytics_location=southcentralus
azure_log_analytics_workspace_name=fast-ops-log

# Debugging
declare -a args=("$resource_group" "$service")
debugService args

# Azure CLI
for application in ${applications[@]}; do
    
    # Configure
    service=$application-$location-$service_code

    setService "Create $service_name" "$service"
        az webapp create \
            --name $service \
            --plan $app_service_plan \
            --resource-group $resource_group \
            --runtime "NODE|lts"

    printStatus "configuring web app"
        az webapp config set \
            --name $service \
            --always-on true \
            --auto-heal-enabled true \
            --ftps-state Disabled \
            --http20-enabled true \
            --linux-fx-version "NODE|lts" \
            --min-tls-version "1.2" \
            --resource-group $resource_group \
            --subscription $subscription \
            --use-32bit-worker-process false \
            --startup-file "pm2 start /home/site/wwwroot/server.js --no-daemon"
           
    printStatus "configuring web app logs"
        az webapp log config \
            --name $service \
            --application-logging true \
            --detailed-error-messages true \
            --docker-container-logging filesystem \
            --failed-request-tracing true \
            --level error \
            --resource-group $resource_group \
            --web-server-logging filesystem

    printStatus "setting https only"
        az webapp update \
            --https-only true \
            --name $service \
            --resource-group $resource_group
    
    printStatus "creating slot for staging"
        az webapp deployment slot create \
            --name $service \
            --resource_group $resource_group \
            --slot stage

    #TODO: Configure staging slot
    # echo "configuring staging slot ..."
        # TODO: echo "enabling FTPS only ..."
        # configure enabling FTPS only on staging slot

    # echo "configuring staging slot - dns zone w/txt record for validation ..."
        #$txt_value = ""
        #az network dns record-set txt add-record --record-set-name $name --resource-group fast-ops-rg --zone-name $dns_zone --value=$txt_value --if-none-match
    
    # echo "configure azure active directory"    

    echo "configuring staging slot - network access restrictions ..."
    echo "configuring IPv4 restrictions ..."
        az webapp config access-restriction add --priority 100 \
            --resource-group $resource_group \
            --name $service-stage \
            --description "Deny access to all except Front Door" \
            --rule-name "Front Door IPv4" \
            --action Allow \
            --ip-address 147.243.0.0/16

    echo "configuring IPv6 restrictions ..."
        az webapp config access-restriction add --priority 200 \
            --resource-group $resource_group \
            --name $service-stage \
            --description "Deny access to all except Front Door" \
            --rule-name "Front Door IPv6" \
            --action Allow \
            --ip-address 2a01:111:2050::/44

    echo "creating slot for last-known-good ..."
        az webapp deployment slot create --name $service -g $resource_group --slot lkg

    echo "internal web sites: http://$service-stage.azurewebsites.net => https://$name-stage.$dns_zone"
    echo "internal web sites: http://$service-lkg.azurewebsites.net => https://$name-lkg.$dns_zone"

    echo "configure customer domain name ..."
    echo "creating web app dns zone w/cname record ..."
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
    
    echo "creating app insight ..."
        # This operation is performed after slot creation because we don't want to copy insight configuration to slots
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
            --settings PORT="7001" APPINSIGHTS_INSTRUMENTATIONKEY="$web_app_insights_instrumentation_key" APPINSIGHTS_PROFILERFEATURE_VERSION="1.0.0" APPINSIGHTS_SNAPSHOTFEATURE_VERSION="1.0.0" APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$web_app_insights_instrumentation_key" ApplicationInsightsAgent_EXTENSION_VERSION="~2" DiagnosticServices_EXTENSION_VERSION="~3" InstrumentationEngine_EXTENSION_VERSION="~1" SnapshotDebugger_EXTENSION_VERSION="disabled" XDT_MicrosoftApplicationInsights_BaseExtensions="~1" XDT_MicrosoftApplicationInsights_Mode="recommended" WEBSITE_HTTPLOGGING_RETENTION_DAYS="7"

    echo "configuring network access restrictions ..."
    echo "configuring IPv4 restrictions ..."
        az webapp config access-restriction add --priority 100 \
            --resource-group $resource_group \
            --name $new_name \
            --description "Deny access to all except Front Door" \
            --rule-name "Front Door IPv4" \
            --action Allow \
            --ip-address 147.243.0.0/16

    echo "configuring IPv6 restrictions ..."
        az webapp config access-restriction add --priority 200 \
            --resource-group $resource_group \
            --name $new_name \
            --description "Deny access to all except Front Door" \
            --rule-name "Front Door IPv6" \
            --action Allow \
            --ip-address 2a01:111:2050::/44

    echo "internal|external web sites: http://$new_name.azurewebsites.net => https://$name.$dns_zone"

done

echo "success !!!"