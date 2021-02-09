#!/bin/bash
source config.sh

: 'AZURE FRONT DOOR SERVICE
A type of Application Delivery Network (ADN) as a service, offering load-balancing 
capabilities for global routing to applications across availability regions using 
active/passive with hot standby approach that also includes dynamic site acceleration.

Ref:
https://docs.microsoft.com/en-us/azure/frontdoor/
https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door?view=azure-cli-latest
'
## TODO's 
## 0. []color,[]motion,[]explore,[]create,[]animation
## 1.[] See "Configuring with Front Door Designer" in "Requirements" below
## 4.[] Setup Alerts https://aka.ms/unified-alerts-docs 
## 5.[] Setup RBAC https://github.com/Azure/azure-cli/issues/13465 https://docs.microsoft.com/en-us/azure/frontdoor/quickstart-create-front-door#create-a-front-door-for-your-application
## 6.[] Setup Locks to prevent access by read-only or deletion if not covered by RBAC
## 7.[] Setup hardened security https://docs.microsoft.com/en-us/azure/key-vault/general/overview-vnet-service-endpoints https://docs.microsoft.com/en-us/azure/web-application-firewall/afds/afds-overview
## 9.[] Script configuration for testability and availability https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door/frontend-endpoint?view=azure-cli-latest#ext-front-door-az-network-front-door-frontend-endpoint-create
##10.[] Configure Diagnostic Settings to
##11.[] Archive to storage account for all metrics
##12.[] Create a health probe https://docs.microsoft.com/azure/frontdoor/front-door-health-probes

#  Requirements
## Configuring with Front Door Designer
## 1.[] Add backend pool
## 2.[] Add two routes, one to forward traffic to the appropriate back end, then another to redirect from http to https
## 3.[] Add frontend pool for the custom domain or subdomain

## Front Door Designer Settings
## [] Enable certificate subject name validation
## [] Send/receive timeout in 16 seconds.

## Custom Domain
## [] Choose fast.design with enabled status and minimum TLS of 1.2
## [] Choose our own custom certificate create by Microsoft domains stored in a Key Vault

## Configurations
## [] Set the route to send traffic for each subdomain to appropriate back end pool, one for each subdomain. Backend pools are the collection of the same site across multiple regions.
## [] Set the route to send traffic from http to https per site
## [] All sites should use https at the end point, 5 second timeouts for faster failovers.

# Install Prerequisite extensions
az extension add --name front-door

# Configure and set name
front_door=$product_name-fd
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

# Create endpoints
# az network front-door frontend-endpoint create --front-door-name $front_door --host-name *.fast.design --name $front_door-ep --resource-group $resource_group
