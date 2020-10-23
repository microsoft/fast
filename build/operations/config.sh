#!/bin/bash

: 'FAST CLI CONFIGURATIONS
Contains all system, application, and Azure cli required configurations.

File is located at $AZURE_CONFIG_DIR/config and generated on first run of `$ bash login.sh`
* On Linux/MacOS: $HOME/.azure
* On Windows: %USERPROFILE%\.azure
'
az configure --defaults output=table disable_confirm_prompt=false enable_log_file=yes log_dir=/log/azure

# TERMINAL CONFIGURATIONS

    set -ex 
    
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

    declare -a applications=("color" "create" "explore" "www")
    declare -a environments=("production" "staging" "development")
    declare -a locations=("westus" "eastus" "centralus")
    declare -a subscriptions=("production" "development")

    system=fast
    status=false

# GETTING STARTED

    echo "----------------------------------------------------------------"
    echo "${bold}${magenta}FAST AZURE OPERATIONS CLI"${reset}
    echo "${bold}${magenta}Scripts are required to run from inside './fast/build/operations'"${reset}
    echo "${magenta}To exit this program enter on [CTRL+c]'"${reset} && echo ""
    echo "${bold}${green}Configuring session ...${reset}"
    echo "${green}Default configurations found.${reset}" && echo ""

# SHELL References
    source functions.sh
    source inputs.sh

# SHELL Prompting
    setEnvironment
    setLocation

# SHELL Operations
    getSubscription