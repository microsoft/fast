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
[[ $debug == true ]] && echo "${bold}${green}Product Name"${reset}${unbold} && echo $product_name

# CONFIGURE / SET LOCATIONS
location_us_west=westus
location_us_east=eastus
location=$location_us_east
location_abbr=${location:0:4}
[[ $debug == true ]] && echo "${bold}${green}Location (abbr)"${reset}${unbold} && echo "$location ($location_abbr)"

# CONFIGURE / SET RESOURCE GROUPS
resource_group_us_west=$product_name-$location_us_west-rg
resource_group_us_east=$product_name-$location_us_east-rg
resource_group=$resource_group_us_east
[[ $debug == true ]] && echo "${bold}${green}Resource Group"${reset}${unbold} && echo $resource_group