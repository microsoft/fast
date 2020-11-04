#!/bin/bash

: 'AZURE CDN
Standard Performance, Read-access GEO-Redundant, name with numbers and lowercase letters only
'

# DEPENDENT Services
    # add blob storage source $dir/service/create-st.sh --location centralus

# Configure
service_type="Content Delivery Network"
service_code="cdn"
service_name=$system-$service_code
service_resource_group=$system-$location-rg
service_endpoint_name=$system-static
service_endpoint_origin=$service_endpoint_name-st.blob.core.windows.net
service_custom_domain_name=$service_endpoint_name-design
service_custom_domain_hostname=static.$system.design

setService "Create $service_type" "$service_name"

# Debugging
declare -a args=(
    "$service_name" 
    "$location" 
    "$service_resource_group" 
    "$service_endpoint_name" 
    "$service_endpoint_origin" 
    "$service_custom_domain_name" 
    "$service_custom_domain_hostname"
    )
debugService args

title="registering resource provider, Microsoft.Cdn"
    printStatus "$title"
    {
        az provider register --namespace "Microsoft.Cdn"

    } || { 
        printStatus "Error: $title" 
    }

title="creating profile"
    printStatus "$title"
    {
        az cdn profile create --name $service_name \
            --resource-group $service_resource_group \
            --location $location \
            --sku Standard_Microsoft

    } || { 
        printStatus "Error: $title" 
    }

title="adding endpoint"
    printStatus "$title"
    {
        az cdn endpoint create --name $service_endpoint_name \
            --origin $service_endpoint_origin \
            --profile-name $service_name \
            --resource-group $service_resource_group \
            --enable-compression true \
            --no-http true \
            --no-wait & wait $!

    } || { 
        printStatus "Error: $title" 
    }

title="creating custom domain"
    printStatus "$title"
    {
        az cdn custom-domain create --endpoint-name $service_endpoint_name \
            --hostname $service_custom_domain_hostname \
            --name $service_custom_domain_name \
            --profile-name $service_name \
            -resource-group fast-operations-rg

    } || { 
        printStatus "Error: $title" 
    }

title="enabling custom domain https only"
    printStatus "$title"
    {
        az cdn custom-domain enable-https --endpoint-name $service_endpoint_name \
            --name $service_custom_domain_name \
            --profile-name $service_name \
            --resource-group $service_resource_group

    } || { 
        printStatus "Error: $title" 
    }
