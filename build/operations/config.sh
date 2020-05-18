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
debug=true && [[ $debug == true ]] && echo "${bold}${green}FAST DEFAULT CONFIGURATION"${reset}${unbold}

# SET PRODUCT NAME
product_name=fast && [[ $debug == true ]] && echo "${bold}${green}Product Name"${reset}${unbold} && echo $product_name

# CONFIGURE / SET SUBSCRIPTION, valid options {production, development}
subscription=production && [[ $debug == true ]] && echo "${bold}${green}Subscription"${reset}${unbold} && echo $subscription
               
# CONFIGURE / SET LOCATIONS, valid options {westus, eastus}
location=eastus
location_abbr=${location:0:4} && [[ $debug == true ]] && echo "${bold}${green}Location (abbr)"${reset}${unbold} && echo "$location ($location_abbr)"

# CONFIGURE / SET RESOURCE GROUPS, valid options {fast-westus-rg, fast-eastus-rg}
resource_group=fast-eastus-rg && [[ $debug == true ]] && echo "${bold}${green}Resource Group"${reset}${unbold} && echo $resource_group
