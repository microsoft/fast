#!/bin/bash

# COMMON TERMINAL CONFIGURATIONS
red=$(tput setaf 1) 
green=$(tput setaf 2) 
reset=$(tput sgr0) 
bold=$(tput smso)
unbold=$(tput rmso)

# COMMON NAMING STANDARDS
## Always use lower case letters
## 1. Prepend with the product name
##    Example: "fast"
## 2. Append the Azure Service with the first letters of each service type
##    Example: "as", would be used for App Service
## 3. Append with random number from 1-9
##    Example, fast-as-1

# SET COMMON VARIABLES
debug=true
iteration=$(( $RANDOM % 10 ))

# SET PRODUCT NAME
product_name=fast
[[ $debug == true ]] && echo "${bold}${green}Product Name"${reset}${unbold}
[[ $debug == true ]] && echo $product_name

# SET GIT REPOSITORY
git_repo=https://github.com/microsoft/fast-dna
[[ $debug == true ]] && echo "${bold}${green}Git Repository"${reset}${unbold}
[[ $debug == true ]] && echo $git_repo

# SET LOCATIONS
## For improved isolation and availability in business continuity disaster recovery (BCDR)
## regionally pair "East US" and "West US" for indepth details on paired regions 
## Ref: https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions
location_us_west=westus
location_us_east=eastus
[[ $debug == true ]] && echo "${bold}${green}Locations"${reset}${unbold}
[[ $debug == true ]] && echo $location_us_west
#[[ $debug == true ]] && echo $location_us_east

# SET RESOURCE GROUPS
resource_group_us_west=$product_name-$location_us_west-rg
#resource_group_us_east=$product_name-$location_us_east-rg

[[ $debug == true ]] && echo "${bold}${green}Resource Groups"${reset}${unbold}
[[ $debug == true ]] && echo $resource_group_us_west
#[[ $debug == true ]] && echo $resource_group_us_east

# CREATE RESOURCE GROUP
## Available locations?  `$ az account list-locations`
az group create --location $location_us_central --name $resource_group_us_central

# CREATE APP SERVICE PLAN
app_service_plan=$product_name-asp-$iteration
[[ $debug == true ]] && echo "${bold}${green}App Service Plan"${reset}${unbold}
[[ $debug == true ]] && echo $app_service_plan

az appservice plan create \
    --name $app_service_plan \
    --resource-group $resource_group_us_central \
    --location $location_us_central \
    --sku P3V2 \
    --only-show-errors \
    --is-linux

# CREATE APP SERVICE
app_service=$product_name-as-$iteration
[[ $debug == true ]] && echo "${bold}${green}App Service"${reset}${unbold}
[[ $debug == true ]] && echo $app_service

az webapp create \
    --name $app_service \
    --plan $app_service_plan \
    --resource-group $resource_group_us_central \
    --runtime "NODE|lts"
    #--startup-file "pm2 start /home/site/wwwroot/server.js --no-daemon"

# Deploy code from a public GitHub repository. 
#az webapp deployment source config --name $app_service --resource-group $resource_group_us_central \
#--repo-url $gitrepo --branch master --manual-integration

# Copy the result of the following command into a browser to see the web app.
echo http://$app_service.azurewebsites.net

exit