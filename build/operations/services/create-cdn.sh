#!/bin/bash
source config.sh

: 'AZURE CDN
Standard Performance, Read-access GEO-Redundant, name with numbers and lowercase letters only

Ref:
https://docs.microsoft.com/en-us/azure/cdn/common/cdn-redundancy
https://docs.microsoft.com/en-us/cli/azure/cdn/account?view=azure-cli-latest#az-cdn-account-create
https://app.pluralsight.com/player?course=microsoft-azure-storage-cors-access-configuring&author=kamran-ayub&name=13da8493-fb46-4ded-9e9c-b7b2d864c24e&clip=0&mode=live
'

#TODOs
# [] Add Get Secret in Key Vault for Microsoft.Azure.Cdn using Azure CLI prior to creating custom domain
# [] Update to endpoing so that it properly waits for completion before continuing to create custom-domain
# [] Add certificate usage for CDN as indicated below by issue.
# [] Configure CORS https://docs.microsoft.com/en-us/azure/cdn/cdn-cors#one-regular-expression-with-all-valid-origins
# [] Add CORS rule via Azure CLI then purge CDN "az cdn endpoint purge -g your-resource-group -n your-endpoint --profile-name your-cdn-profile --content-paths '/*'""
# [] Redirect all HTTP traffic to HTTPS https://docs.microsoft.com/en-us/azure/cdn/cdn-standard-rules-engine 

# Configure and set name
product_name=fast

cdn_profile_name=$product_name-cdn
cdn_resource_group=$product_name-ops-rg
cdn_location=centralus

cdn_endpoint_name=fast-static
cdn_endpoint_origin=fastst.blob.core.windows.net

cdn_custom_domain_name=$cdn_endpoint_name-design
cdn_custom_domain_hostname=static.fast.design

[[ $debug == true ]] && echo "${bold}${green}CDN"${reset}${unbold} && echo $cdn_profile_name
[[ $debug == true ]] && echo "${bold}${green}Location"${reset}${unbold} && echo $cdn_location

echo "registering 'Microsoft.Cdn' resource provider on current subscription ..."
az provider register --namespace "Microsoft.Cdn"

echo "creating cdn profile ..."
az cdn profile create --name $cdn_profile_name --resource-group $cdn_resource_group \
    --location $cdn_location \
    --sku Standard_Microsoft

echo "adding an endpoint ..."
az cdn endpoint create --name $cdn_endpoint_name --origin $cdn_endpoint_origin --profile-name $cdn_profile_name --resource-group $cdn_resource_group \
    --enable-compression true \
    --no-http true \
    --no-wait & wait $!

# Issue: https://github.com/Azure/azure-cli/issues/13678 requiring the previous line of code to require `& wait $!` for the process to complete.

echo "creating custom domain ..."
az cdn custom-domain create --endpoint-name $cdn_endpoint_name --hostname $cdn_custom_domain_hostname --name $cdn_custom_domain_name --profile-name $cdn_profile_name --resource-group $cdn_resource_group

echo "enabling custom domain https only ..."
az cdn custom-domain enable-https --endpoint-name $cdn_endpoint_name --name $cdn_custom_domain_name --profile-name $cdn_profile_name --resource-group $cdn_resource_group

# Issue: https://github.com/Azure/azure-cli/issues/13679 missing information on how to configure `--custom-domain-https-parameters` in the above command.


