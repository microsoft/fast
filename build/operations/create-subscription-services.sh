#!/bin/bash
source config.sh

: 'CREATE SUBSCRIPTION SERVICES
These services are located at subscription root and environment specific because we have
three subscriptions, one each, for production, staging, and development. Isolation in this 
way will help improve security. For example, if Key Vault is compromised in Development, there
is another Key Vault in Production with different Secrets, Keys, and Certificates so access is
prevented.
'

: 'CREATE KEY VAULT
Takes backups on regular cadence and as objects stored within the Key Vault change.

Ref: 
https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices
'

# SET KEY VAULT
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