#!/bin/bash
source config.sh
source inputs.sh

: 'AZURE OPERATIONS RESOURCE GROUP (fast-ops-rg)
These services are located at subscription root and environment specific, one each, for production and development. 
Isolating by environment improves security. Key Vault stores secrets, keys, and certificates. If Key Vault is 
compromised in development, that same vault information is not redundant in other environment Key Vaults.

These services (Front Door, Key Vault, CDN) are manually created and locked except for administrators and owners.  

Note: Some aspects of Key Vault are in preview and not creatable using Azure CLI.
'

# Configure and set name
resource_group=$product_name-ops-rg
[[ $debug == true ]] && echo "${bold}${green}Resource Group (Operations)"${reset}${unbold} && echo $resource_group

# Create resource group
source ../services/create-rg.sh --resource-group $resource_group

# Lock resource group

az group create --location centralus --name $resource_group


# Create DNS Zone
# Lock DNS Zone




