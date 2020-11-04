#!/bin/bash

: 'AZURE LOG ANALYTICS
Log queries help you to fully leverage the value of the data collected in Azure Monitor Logs. 
A powerful query language allows you to join data from multiple tables, aggregate large sets 
of data, and perform complex operations with minimal code. Virtually any question can be answered 
and analysis performed as long as the supporting data has been collected, and you understand how 
to construct the right query.
'

# Configure
service_type="Log Analytics"
service_code="log"
service_resource_group=$system-analytics-rg
service_name=$system-operations-$service_code
service_location=centralus
service_retention=90

# Validation
## The operations resource group must exist for hosting Global Azure services 
title="checking pre-requisites"
    printStatus "$title"
    {
        check=$(az group exists --name $service_resource_group --subscription $subscription)
        if [[ $check == false ]];
        then # Create operations resource group for non-locale specific services
        
            setService "Create $service_type" "$service_resource_group"
            
            az group create \
                --location "centralus" \
                --name $service_resource_group
       fi
    } || {
        printStatus "Error: $title"
    }

# Install Prerequisite extensions
az extension add -n application-insights

setService "Create $service_type" "$service_name"

# Debugging
declare -a args=("$service_resource_group" "$service_name")
debugService args

title="creating log analytics workspace"
    printStatus "$title"
    {
        az monitor log-analytics workspace create --resource-group $service_resource_group \
            --workspace-name $service_name \
            --location $service_location \
            --retention-time $service_retention
    } || {
        printStatus "Error: $title"
    }
