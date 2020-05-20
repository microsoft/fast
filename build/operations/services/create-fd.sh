#!/bin/bash
source config.sh

: 'AZURE FRONT DOOR SERVICE
A scalable and secure entry point for fast delivery of global web applications using 
active/hot standby for regional resource groups.

Ref:
https://docs.microsoft.com/en-us/azure/frontdoor/
https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door?view=azure-cli-latest
'
#TODO: 
# [ []color,[]app,[]motion,[]explore,[]create,[]animation,[]www] West region - Setup pipelines for each website to staging.
#   1. deploy color to new servers
#   2. update DNS to fd
#   3. manually add custom domain / cert

# [] Enable RBAC https://github.com/Azure/azure-cli/issues/13465 
# [] How do I lock down the access to my backend to only Azure Front Door?
# [] Investigate https://docs.microsoft.com/en-us/azure/key-vault/general/overview-vnet-service-endpoints for better security
# [] DNS could be updated once all rules are in place on FD, so that we only have wildcard for subdomains

# Install Prerequisite extensions
az extension add --name front-door

# Configure and set name
front_door=$product_name-fd-test
resource_group=$product_name-ops-rg

# Create front door
az network front-door create --backend-address "fast-front.azurefd.net" \
    --name $front_door \
    --resource-group $resource_group \
    --accepted-protocols https \
    --enforce-certificate-name-check Enabled \
    --friendly-name "Fast Front Door" \
    --interval 15 \
    --path / \
    --send-recv-timeout 30

# https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door/frontend-endpoint?view=azure-cli-latest#ext-front-door-az-network-front-door-frontend-endpoint-create
# az network front-door frontend-endpoint create --front-door-name $front_door --host-name *.fast.design --name $front_door-ep --resource-group $resource_group