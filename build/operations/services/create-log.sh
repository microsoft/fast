#!/bin/bash
source config.sh

: 'AZURE LOG ANALYTICS


Ref:
https://docs.microsoft.com/en-gb/azure/azure-monitor/overview
https://docs.microsoft.com/en-us/cli/azure/monitor/log-analytics/workspace?view=azure-cli-latest
'
# Install Prerequisite extensions
az extension add -n application-insights

# Configure and set name
product_name=fast
azure_log_analytics_workspace_name=$product_name-ops-log
azure_log_analytics_resource_group=$product_name-ops-rg
azure_log_analytics_location=southcentralus
azure_log_analytics_retention=90

echo "creating log analytics workspace ..."
az monitor log-analytics workspace create --resource-group $azure_log_analytics_resource_group --workspace-name $azure_log_analytics_workspace_name \
    --location $azure_log_analytics_location \
    --retention-time $azure_log_analytics_retention
