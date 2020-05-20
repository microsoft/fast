#!/bin/bash
source config.sh

: 'AZURE STORAGE
Standard Performance, Read-access GEO-Redundant, name with numbers and lowercase letters only

Ref:
https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy
https://docs.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create
'

storage=$product_name-st
[[ $debug == true ]] && echo "${bold}${green}Storage"${reset}${unbold} && echo $storage

az storage account create --name $storage --resource-group $resource_group \
    --enable-hierarchical-namespace true \
    --https-only true \
    --kind StorageV2 \
    --location westus2 \
    --sku Standard_RAGRS
