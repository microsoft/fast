#!/bin/bash

: 'AZURE RESOURCE GROUPS
For improved isolation and availability in business continuity disaster recovery (BCDR) 
regionally pair "East US" and "West US" for indepth details on paired regions.
'

# Configure
service_name="Resource Group"
service_code="rg"
service=$system-$location-$service_code

setService "Delete $service_name" "$service"

# Debugging
declare -a args=(
    "$service" 
    "$location"
    "$resource_group"
    )
debugService args

title="deleting resource group"
    printStatus "$title"
    {
        az group delete \
            --name $service \
            --resource-group $service \
            --yes

    } || {
        printStatus "Error: $title"
    }
