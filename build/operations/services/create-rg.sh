#!/bin/bash

: 'AZURE RESOURCE GROUPS
For improved isolation and availability in business continuity disaster recovery (BCDR) 
regionally pair "East US" and "West US" for indepth details on paired regions.
'

# Configure
service_type="Resource Group"
service_code="rg"

if [[ -z "$name" ]];
then
    service_name=$system-$location-$service_code
else
    service_name=$name
fi

setService "Create $service_type" "$service_name"

# Debugging
declare -a args=(
    "$service_name" 
    "$location"
    )
debugService args

title="creating resource group"
    printStatus "$title"
    {
        az group create \
            --location $location \
            --name $service_name
    
    } || {
        printStatus "Error: $title"
    }

export az_resource_group="$service_name"
