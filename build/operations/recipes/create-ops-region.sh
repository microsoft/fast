#!/bin/bash

: 'AZURE OPERATIONS RESOURCE GROUP (fast-ops-rg)
These services are located at subscription root and environment specific, one each, for production and development. 
Isolating by environment improves security. Key Vault stores secrets, keys, and certificates. If Key Vault is 
compromised in development, that same vault information is not redundant in other environment Key Vaults.

These services (Front Door, Key Vault, CDN) are manually created and locked except for administrators and owners.  

Note: Some aspects of Key Vault are in preview and not creatable using Azure CLI.
'
# GLOBAL Configurations
    source config.sh

    # Product: valid options {fast}
    product=fast

    # Subscription: valid options {production, development}
    subscription=production

    # Location: valid options {centralus}
    location=centralus && location_abbr=${location:0:7} 

    # Resource group: valid options {fast-centralus-rg}
    resource_group=$product-ops-rg

    # DNS Zone
    dns_zone=fast.design

## SHELL Arguments
source inputs.sh --debug true --product $product --subscription $subscription --location $location --resource-group $resource_group

# Create Global Region (Central)
source $dir/services/create-rg.sh & wait $!
source $dir/services/create-dns.sh & wait $!
source $dir/services/create-kv.sh & wait $!
source $dir/services/create-fd.sh & wait $!
source $dir/services/create-log.sh & wait $!

