#!/bin/bash

: 'SET DEFAULT CONFIGURATION
File is located at $AZURE_CONFIG_DIR/config and generated on first run of `$ bash login.sh`
* On Linux/MacOS: $HOME/.azure
* On Windows: %USERPROFILE%\.azure
'
az configure --defaults output=table disable_confirm_prompt=false enable_log_file=yes log_dir=/log/azure

# TERMINAL CONFIGURATIONS

    black=$(tput setaf 0)
    red=$(tput setaf 1) 
    green=$(tput setaf 2)
    yellow=$(tput setaf 3)
    blue=$(tput setaf 4)
    magenta=$(tput setaf 5)
    cyan=$(tput setaf 6)
    white=$(tput setaf 7)
    white_f=$(tput setab 7)
    standout=$(tput smso)
    bold=$(tput bold)
    blink=$(tput blink)
    reset=$(tput sgr0) 

# COMMON VARIABLES
    
    debug=false
    dir=$(PWD)

    declare -a applications=("app" "color" "create" "explore" "motion" "www" "exit")
    declare -a environments=("production" "staging" "development" "exit")
    declare -a regions=("westus" "eastus" "exit")
    declare -a subscriptions=("production" "development" "exit")

    status=false

# GETTING STARTED

    echo "----------------------------------------------------------------"
    echo "${bold}${magenta}FAST AZURE OPERATIONS CLI"${reset}
    echo "${bold}${magenta}Scripts are required to run from inside './fast/build/operations'"${reset} && echo ""
    echo "${bold}${green}Configuring session ...${reset}"
    echo "${green}Default configurations found.${reset}" && echo ""

# SHELL Arguments
    source inputs.sh
    source $dir/functions.sh

# SHELL Prompting
    setEnvironment
    setRegion
   
# SHELL Operations
    getSubscription
    
