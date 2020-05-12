## CREATE STORAGE
# Standard Performance, Read-access GEO-Redundant, name with numbers and lowercase letters only
# Description: https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy
# Configurations: https://docs.microsoft.com/en-us/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create

storage=$product_name"storeage"$iteration
[[ $debug == true ]] && echo "${bold}${green}Storage"${reset}${unbold}
[[ $debug == true ]] && echo $storage

az storage account create --name $storage --resource-group $resource_group_us_west \
    --enable-hierarchical-namespace true \
    --https-only true \
    --kind StorageV2 \
    --location westus2 \
    --sku Standard_RAGRS
