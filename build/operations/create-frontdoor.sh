#!/bin/bash
source config.sh

# 'fast-ops-rg' resource group is for operations related services only, Key Vault, CDN, Front Door, and is locked 
# except for Administrators and Owners

# Lock Resource Group : https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-cli#lock-resource-groups
# az lock create --name LockGroup --lock-type CanNotDelete --resource-group $resource_group

# Set Defaults
front_door=$product_name-fd-test
resource_group=$product_name-ops-rg

# Install Prerequisit extensions
az extension add --name front-door

: 'CREATE NETWORK FRONT DOOR
Creates a Front Door service to manage active/hot standby for regional resource groups.

TODOs
1. Update FQDN for --backend-address

Ref:
https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door?view=azure-cli-latest
'

# TODO: 
# 1.[x] Migrate DNS to Azure DNS
# 2.[9am] Delegate DNS from Domains to Azure DNS
# 3.[] Verify DNS Delegation https://prod.msftdomains.com/NameServer/Index/?id=1095 
# 3.[] Setup temporary Front Door CNAME and Create Customer Domain https://docs.microsoft.com/en-us/azure/frontdoor/front-door-custom-domain
# 4.[] Update Apex/root/naked domain zone https://docs.microsoft.com/en-us/azure/frontdoor/front-door-how-to-onboard-apex-domain
# 5.[] Setup wildcard domains https://docs.microsoft.com/en-us/azure/frontdoor/front-door-wildcard-domain
# 6.[] How do I lock down the access to my backend to only Azure Front Door?

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