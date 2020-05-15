#!/bin/bash

: 'SET DEFAULT CONFIGURATION
File is located at $AZURE_CONFIG_DIR/config and generated on first run of `$ bash login.sh`
* On Linux/MacOS: $HOME/.azure
* On Windows: %USERPROFILE%\.azure
'
az configure --defaults output=table disable_confirm_prompt=false enable_log_file=yes log_dir=/log/azure

# COMMON TERMINAL CONFIGURATIONS
red=$(tput setaf 1) 
green=$(tput setaf 2) 
reset=$(tput sgr0) 
bold=$(tput smso)
unbold=$(tput rmso)

# SET COMMON VARIABLES
debug=true


# SET PRODUCT NAME
product_name=fast
[[ $debug == true ]] && echo "${bold}${green}Product Name"${reset}${unbold}
[[ $debug == true ]] && echo $product_name


: 'CONFIGURE SUBSCRIPTIONS
TODO: store these in GitHub Secrets
TODO: retrieve from GitHub Secrets
TODO: dev available after subscription migration or if create new subscription
'
subscription_production="07b166d9-9849-4c8e-8df4-3f039daf5a05"
subscription_staging="635254d3-38dc-4c67-b447-de5a723db1f7"

# SET SUBSCRIPTION
subscription=$subscription_production
[[ $debug == true ]] && echo "${bold}${green}Subscription"${reset}${unbold}
[[ $debug == true ]] && echo $subscription


: 'CONFIGURE LOCATIONS
For improved isolation and availability in business continuity disaster recovery (BCDR) 
regionally pair "East US" and "West US" for indepth details on paired regions 

Ref: 
https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions
'
location_us_west=westus
location_us_east=eastus

# SET LOCATION
location=$location_us_west
[[ $debug == true ]] && echo "${bold}${green}Location"${reset}${unbold}
[[ $debug == true ]] && echo $location

# SET LOCATION ABBREVIATION
location_abbr=${location:0:4}
[[ $debug == true ]] && echo "${bold}${green}Location Abbreviation"${reset}${unbold}
[[ $debug == true ]] && echo $location_abbr


: 'CONFIGURE RESOURCE GROUP
West & East have been chosen for pairing services to provide the most resiliency.

Ref:
https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/multi-region#regional-pairing
'
# CONFIGURE RESOURCE GROUPS
resource_group_us_west=$product_name-$location_us_west-rg
resource_group_us_east=$product_name-$location_us_east-rg

# SET RESOURCE GROUP
resource_group=$resource_group_us_west
[[ $debug == true ]] && echo "${bold}${green}Resource Groups"${reset}${unbold}
[[ $debug == true ]] && echo $resource_group
