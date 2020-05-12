#!/bin/bash
source config.sh

: 'CREATE KEY VAULT
Takes backups on regular cadence and as objects stored within the Key Vault change.

Ref: 
https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices
'

keyvault=$product_name"-kv-"
[[ $debug == true ]] && echo "${bold}${green}Key Vault"${reset}${unbold}
[[ $debug == true ]] && echo $keyvault

az keyvault create -name $keyvault create

: 'TODOs
1. set access policy
2. set backup
3. set logging
4. upload certificate
5. configure Logic Apps can use key vault as well.

1. region = fast-frontdoor-west 
2. add keyvault here
3. add cnd here
4. add frontdoor
'