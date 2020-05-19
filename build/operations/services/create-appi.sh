#!/bin/bash
source config.sh

: 'AZURE MONITOR WITH APP INSIGHTS


Ref:
https://docs.microsoft.com/en-gb/azure/azure-monitor/overview
https://docs.microsoft.com/en-us/cli/azure/ext/application-insights/monitor/app-insights?view=azure-cli-latest
'
# Install Prerequisite extensions
az extension add -n application-insights

# Configure and set name
product_name=fast
azure_monitor_app_insights_name=$product_name-app
azure_monitor_app_insights_resource_group=$product_name-ops-rg
azure_monitor_app_insights_location=centralus

echo "creating log analytics workspace ..."
az monitor log-analytics workspace create --resource-group $azure_monitor_resource_group --workspace-name $azure_monitor_workspace_name \
    --location $azure_monitor_location \
    --retention-time $azure_monitor_retention
