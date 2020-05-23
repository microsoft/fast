#!/bin/bash
source config.sh

: 'AZURE STORAGE
Standard Performance, Read-access GEO-Redundant, name with numbers and lowercase letters only

Ref:
https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy
https://docs.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create
'

storage=$product_name-st && [[ $debug == true ]] && echo "${bold}${green}Storage"${reset}${unbold} && echo $storage
location=westus2 && [[ $debug == true ]] && echo "${bold}${green}Location"${reset}${unbold} && echo $location

az storage account create --name $storage --resource-group $resource_group \
    --enable-hierarchical-namespace true \
    --https-only true \
    --kind StorageV2 \
    --location $location \
    --sku Standard_RAGRS


# TODOs
# [] Create a container for blob storage, with public access level of anonymous read access for containers and blobs)
# [] Create blob storage
# [] Create a CDN Profile, 
# [] Create a new cdn endpoint with storage origin type.
# [] Test: Upload a file into blog storage through web portal
# [] Test: go to CDN Profile again and expand the endpoint to copy the origin hostname and paste into URL, while remembering the blog and file name to append to the url path


# Questions:
# How does front door manage dynamic site acceleration?  If it does not, CDN should.
# 


# Requirements:
# [] general web delivery optimization should be used for average files smaller than 10MB
# [] Large file optimization should be used for average file size over 10MB