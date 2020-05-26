#!/bin/bash
source config.sh

: 'AZURE STORAGE
Standard Performance, Read-access GEO-Redundant, name with numbers and lowercase letters only

Ref:
https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy
https://docs.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create
https://docs.microsoft.com/en-us/azure/azure-monitor/insights/storage-insights-overview
'
# Configure and set name
product_name=fast
storage_name=$product_name"st"
storage_resource_group=$product_name-ops-rg
storage_location=westus2

[[ $debug == true ]] && echo "${bold}${green}Storage"${reset}${unbold} && echo $storage_name
[[ $debug == true ]] && echo "${bold}${green}Location"${reset}${unbold} && echo $storage_location

echo "creating storage account ..."
az storage account create --name $storage_name --resource-group $storage_resource_group \
    --enable-hierarchical-namespace true \
    --https-only true \
    --kind StorageV2 \
    --location $storage_location \
    --sku Standard_RAGRS \
    --access-tier Hot 

echo "creating storage container ..."
az storage container create --name "assets" \
    --account-name $storage_name \
    --public-access blob 

# TODOs
# [] How to deploy CDN Assets to Storage Account
# [] Enable soft delete by Azure CLI
# [] How to enable advanced threat protection on azure storage with Azure CLI
# [] Manage storage account keys in key vault. https://docs.microsoft.com/en-us/azure/key-vault/secrets/overview-storage-keys
# [] Secure: https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#scenarios
# [] Configure FireWall Rules https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#cliv2
# [] Enable advanced threat protection
# [] Create another storage account for logging