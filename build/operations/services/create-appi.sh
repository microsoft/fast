#!/bin/bash

: 'AZURE APP INSIGHTS
Insights provide a customized monitoring experience for particular applications and services. 
They store data in the Azure Monitor data platform and leverage other Azure Monitor features 
for analysis and alerting but may collect additional data and provide a unique user experience 
in the Azure portal. Access insights from the Insights section of the Azure Monitor menu in 
the Azure portal.
'

# Configure
service_type="Application Insights"
service_code="appi"
service_location=centralus
service_resource_group=$system-analytics-rg
service_workspace_name=$system-operations-log

# Azure CLI
for application in ${applications[@]}; do
    
    service_name=$application-$location-$service_code
    setService "Create $service_type" "$service_name"

    title="creating app insights"
        printStatus "$title"
        {
            az monitor app-insights component create --app $service_name \
                --location $service_location \
                --resource-group $service_resource_group \
                --kind web \
                --application-type web \
                --workspace $service_workspace_name

            service_instrumentation_key=$(az monitor app-insights component show --app $service_name -g $service_resource_group --output tsv --query instrumentationKey)
        } || {
            printStatus "Error: $title"
        }
    
    title="configuring app insights [$service_instrumentation_key]"
        printStatus "$titler"
        {
            az webapp config appsettings set --resource-group $system-$location-rg \
                --name $application-$location-app \
                --settings PORT="7001" APPINSIGHTS_INSTRUMENTATIONKEY="$service_instrumentation_key" APPINSIGHTS_PROFILERFEATURE_VERSION="1.0.0" APPINSIGHTS_SNAPSHOTFEATURE_VERSION="1.0.0" APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$service_instrumentation_key" ApplicationInsightsAgent_EXTENSION_VERSION="~2" DiagnosticServices_EXTENSION_VERSION="~3" InstrumentationEngine_EXTENSION_VERSION="~1" SnapshotDebugger_EXTENSION_VERSION="disabled" XDT_MicrosoftApplicationInsights_BaseExtensions="~1" XDT_MicrosoftApplicationInsights_Mode="recommended" WEBSITE_HTTPLOGGING_RETENTION_DAYS="7"
     
        } || {
            printStatus "Error: $title"
        }

done 

