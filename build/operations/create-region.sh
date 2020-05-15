#!/bin/bash
source config.sh

echo "[]- Starting .."
echo "[]- Vaildating .."

# TODO
# ADD CLI QUESTION
# Is your configuration accurate?
# Is your subscription: $subscription?
# Is your location: $location?
# Is your resource group: $resource_group?

# CREATE RESOURCE GROUP
az group create --location $location --name $resource_group


# CREATE APP SERVICE PLAN
app_service_plan=$location_abbr-asp
[[ $debug == true ]] && echo "${bold}${green}App Service Plan"${reset}${unbold}
[[ $debug == true ]] && echo $app_service_plan

az appservice plan create --name $app_service_plan --resource-group $resource_group --location $location \
    --sku P3V2 \
    --only-show-errors \
    --is-linux


source configure-web-apps.sh