#!/bin/bash

<<COMMENT SET DEFAULT CONFIGURATION
File is located at $AZURE_CONFIG_DIR/config and generated on first run of `$ bash login.sh`
* On Linux/MacOS: $HOME/.azure
* On Windows: %USERPROFILE%\.azure
COMMENT

az configure --defaults output=table disable_confirm_prompt=false enable_log_file=yes log_dir=/log/azure

# COMMON TERMINAL CONFIGURATIONS
red=$(tput setaf 1) 
green=$(tput setaf 2) 
reset=$(tput sgr0) 
bold=$(tput smso)
unbold=$(tput rmso)

# SET COMMON VARIABLES
debug=true
iteration=$(( $RANDOM % 10 ))

# SET PRODUCT NAME
product_name=fast
[[ $debug == true ]] && echo "${bold}${green}Product Name"${reset}${unbold}
[[ $debug == true ]] && echo $product_name

# SET SUBSCRIPTION
# TODO: store these in GitHub Secrets
# TODO: retrieve from GitHub Secrets
# TODO: dev available after subscription migration or if create new subscription
subscription_production="07b166d9-9849-4c8e-8df4-3f039daf5a05"
subscription_staging="635254d3-38dc-4c67-b447-de5a723db1f7"
subscription_development="??"
