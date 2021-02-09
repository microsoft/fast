#!/bin/bash

: 'AZURE NETWORK DNS ZONE 
Azure DNS is a hosting service for DNS domains that provides name resolution by using Microsoft Azure infrastructure. 
By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and 
billing as your other Azure services.
'

# Configure
service_type="Network DNS"
service_code="dns"
service_name=$system.design

setService "Create $service_type" "$service_name"

# Debugging
declare -a args=(
    "$service_type"
    "$se4rvice_code"
    "$service_name"
    )
debugService args

title="creating dns zone"
    printStatus "$title"
    {
        az network dns zone create \
            --name $service_name \
            --resource-group $resource_group \
            --if-none-match

    } || {
        printStatus "Error: $title"
    }

title="creating dns cname records"
    printStatus "$title"
    {
        az network dns record-set cname set-record \
            --cname "status" \
            --record-set-name "status" \
            --resource-group $resource_group \
            --zone-name $service_name \
            --if-none-match
    
    } || {
        printStatus "Error: $title"
    }

title="viewing dns records"
    
    printStatus "$title"
    {
        az network dns record-set list \
            --resource-group $resource_group \
            --zone-name $service_name
    } || {
        printStatus "Error: $title"
    }
