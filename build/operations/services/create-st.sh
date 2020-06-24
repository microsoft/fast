#!/bin/bash
source config.sh

: 'AZURE STORAGE
Standard Performance, Read-access GEO-Redundant, name with numbers and lowercase letters only

Security Attributes
- Requires secure transfer
- Stores business critical data with immutable storage
- Advanced threat protection is enabled
- Blob public access is enabled as required by continuous delivery process

Disaster Recovery
- Data redundancy through copies in secondary region (RA-GRS)

Ref:
https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy
https://docs.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance
https://docs.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create
https://docs.microsoft.com/en-us/azure/azure-monitor/insights/storage-insights-overview
https://docs.microsoft.com/en-us/azure/storage/common/storage-require-secure-transfer
https://docs.microsoft.com/en-us/cli/azure/storage/blob/service-properties?view=azure-cli-latest
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

echo "enabling soft delete ..."
az storage blob service-properties delete-policy update --days-retained 30 --account-name $storage_name --enable true

# TODOs
# [] How to enable advanced threat protection on azure storage with Azure CLI
# [] Manage storage account keys in key vault. https://docs.microsoft.com/en-us/azure/key-vault/secrets/overview-storage-keys
# [] Secure: https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#scenarios
# [] Configure FireWall Rules https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#cliv2
# [] Create another storage account for logging
# [] Convert to use VNET to control Network Restrictions including Storage