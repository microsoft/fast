#!/bin/bash

: 'AZURE RESOURCE GROUPS
For improved isolation and availability in business continuity disaster recovery (BCDR) 
regionally pair "East US" and "West US" for indepth details on paired regions.
'

# Configure
service_type="Resource Group"
service_code="rg"
service_name=$system-operations-$service_code

# Create locale specific services as denoted during CLI prompting
service_name=$system-$location-$service_code
setService "Create $service_type" "$service_name"

# Debugging
declare -a args=("$service_name" "$location")
debugService args

az group create \
    --location $location \
    --name $service_name

export az_resource_group="$service_name"