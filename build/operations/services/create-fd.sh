#!/bin/bash
source config.sh

: 'AZURE FRONT DOOR SERVICE
A scalable and secure entry point for fast delivery of global web applications using 
active/hot standby for regional resource groups.

Ref:
https://docs.microsoft.com/en-us/azure/frontdoor/
https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door?view=azure-cli-latest
'

# Install Prerequisite extensions
az extension add --name front-door

# Configure and set name
front_door=$product_name-fd-test
resource_group=$product_name-ops-rg

# TODO: 
# 0.[] Update FQDN for --backend-address
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