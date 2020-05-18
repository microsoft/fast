#!/bin/bash
source config.sh

: 'AZURE KEY VAULT
Key Vault is used to create and maintain keys that access and encrypt your cloud resources, apps, and solutions.

TODOs (Unknown details to perform at this time using Azure CLI)
1. Set access policy
2. Perform manual backups using Azure CLI, not PowerShell
3. Perform logging using Azure CLI, not PowerShell
4. Perform CLI upload of certificate
5. Configure Logic Apps can use key vault as well.

Ref: 
https://docs.microsoft.com/en-us/azure/key-vault/general/
https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices
https://docs.microsoft.com/en-us/azure/key-vault/general/logging
https://docs.microsoft.com/en-us/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy
https://docs.microsoft.com/en-us/azure/key-vault/general/security-recommendations
https://docs.microsoft.com/en-us/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-backup
https://docs.microsoft.com/en-us/azure/key-vault/secrets/overview-storage-keys
'

# Configure and set name
keyvault=$product_name-ops-kv
[[ $debug == true ]] && echo "${bold}${green}Key Vault"${reset}${unbold} && echo $keyvault

az keyvault create --name $keyvault --resource-group $resource_group \
    --sku standard \
    --enable-purge-protection true \
    --enable-soft-delete true 

az keyvault update --name $keyvault \
    --retention-days 90

#az keyvault set-policy --$keyvault
