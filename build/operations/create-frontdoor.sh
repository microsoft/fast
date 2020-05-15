#!/bin/bash
source config.sh

: 'CREATE RESOURCE GROUP
This resource group is for operations related services only.
'
resource_group=$product_name-nfd-rg
[[ $debug == true ]] && echo "${bold}${green}Resource Group (Front Door)"${reset}${unbold}
[[ $debug == true ]] && echo $resource_group

az group create --location $location --name $resource_group

: 'CREATE NETWORK FRONT DOOR
Creates a Front Door service to manage active/hot standby for regional resource groups.

TODOs
1. Update FQDN for --backend-address

Ref:
https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door?view=azure-cli-latest
'

front_door=$product_name-fd
[[ $debug == true ]] && echo "${bold}${green}Front Door"${reset}${unbold}
[[ $debug == true ]] && echo $front_door

az network front-door create --backend-address "https://fast-design.azurewebsites.net" --name $front_door --resource-group $resource_group \
    --accepted-protocols https \
    --enforce-certificate-name-check Enabled \
    --friendly-name "Front Door West" \
    --interval 15 \
    --path / \
    --send-recv-timeout 30

az network front-door frontend-endpoint create --front-door-name $front_door --host-name *.fast.design --name $front_door-ep --resource-group $resource_group 
# Getting started step 1: https://docs.microsoft.com/en-us/azure/frontdoor/front-door-custom-domain
# secure How do I lock down the access to my backend to only Azure Front Door?
# configure custom apex domain: https://docs.microsoft.com/en-us/azure/frontdoor/front-door-how-to-onboard-apex-domain
# TODO: Handling wildcard domains instead of each subdomain individually
# https://docs.microsoft.com/en-us/azure/frontdoor/front-door-wildcard-domain
# https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door/frontend-endpoint?view=azure-cli-latest#ext-front-door-az-network-front-door-frontend-endpoint-create


