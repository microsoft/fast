#!/bin/bash
source config.sh

: 'CREATE SUBSCRIPTION SERVICES
These services are located at subscription root and environment specific because we have
three subscriptions, one each, for production, staging, and development. Isolation in this 
way will help improve security. For example, if Key Vault is compromised in Development, there
is another Key Vault in Production with different Secrets, Keys, and Certificates so access is
prevented.
'

: 'CREATE RESOURCE GROUP
This resource group is for operations related services only.
'
resource_group=$product_name-ops-rg
[[ $debug == true ]] && echo "${bold}${green}Resource Group (Operations)"${reset}${unbold}
[[ $debug == true ]] && echo $resource_group

az group create --location centralus --name $resource_group


: 'CREATE KEY VAULT
Takes backups on regular cadence and as objects stored within the Key Vault change.

TODOs (Unknown details to perform at this time using Azure CLI)
1. Set access policy
2. Perform manual backups using Azure CLI, not PowerShell
3. Perform logging using Azure CLI, not PowerShell
4. Perform CLI upload of certificate
5. Configure Logic Apps can use key vault as well.

Ref: 
https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices
https://docs.microsoft.com/en-us/azure/key-vault/general/logging
https://docs.microsoft.com/en-us/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy
https://docs.microsoft.com/en-us/azure/key-vault/general/security-recommendations
https://docs.microsoft.com/en-us/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-backup
https://docs.microsoft.com/en-us/azure/key-vault/secrets/overview-storage-keys
'
keyvault=$product_name-ops-kv
[[ $debug == true ]] && echo "${bold}${green}Key Vault"${reset}${unbold}
[[ $debug == true ]] && echo $keyvault

az keyvault create --name $keyvault --resource-group $resource_group \
    --sku standard \
    --enable-purge-protection true \
    --enable-soft-delete true 

az keyvault update --name $keyvault \
    --retention-days 90

#az keyvault set-policy --$keyvault


: 'CREATE CDN

Ref:

'
