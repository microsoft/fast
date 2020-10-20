#!/bin/bash

: 'FAST CLI FUNCTIONS
Contains internal fast functions for processing Azure required logic.
'

function debugService() {
    if [[ $debug == true ]]; then
        echo "${yellow}"
        props=$1
        for arg in "${args[@]}"; do
            echo "${arg}"
        done
        echo "${reset}"
    fi
}

function debugStatus() {
    if [[ $debug == true ]]; then
        echo ""
    fi
}

function debugSystem() {
    if [[ $debug == true ]];
    then 
        echo "${yellow}"
        echo "bash version: $BASH_VERSION"
        echo "host: $HOSTNAME"
        echo "machine: $MACHTYPE"
        echo "shell: $SHELL"
        echo "path: $dir"
        echo "home: $HOME"
        echo "${reset}"
    fi
}

function getSubscription() {
    source inputs.sh --subscription $subscription
}

function setApplication() {
    if [ -z "$application" ];
    then
        echo "Select an ${bold}${green}Application${reset}:"    
        select application in ${applications[@]}
        do
            case $application in
                app | color | create | explore | motion | www)
                    source inputs.sh -a $application
                    break ;;
                exit)
                    echo "${bold}${green}cancelled.${reset}" 
                    exit ;;
                *)
                    echo "${red}invalid entry, try again${reset}" 
                    ;;
            esac
        done
    fi
}

function setEnvironment() {
    if [ -z "$environment" ];
    then
        echo "Select an ${bold}${green}Environment${reset}:"
        select environment in ${environments[@]}
        do
            case $environment in
                production | development)
                    source inputs.sh -e $environment -s $environment 
                    break ;;
                staging)
                    source inputs.sh -e $environment -s production
                    break ;;
                exit)
                    echo "${bold}${green}cancelled.${reset}" 
                    exit ;;
                *)
                    echo "${red}invalid entry, try again${reset}" 
                    ;;
            esac
        done
    fi
}

function setLocation() {
    if [ -z "$region" ];
    then
        echo "Select an ${bold}${green}Location${reset}:"    
        select location in ${locations[@]}
        do
            case $location in
                westus | eastus)  
                    resource_group=fast-$location-rg
                    break ;;
                centralus)  
                    resource_group=fast-ops-rg
                    break ;;
                exit)
                    echo "${bold}${green}cancelled.${reset}" 
                    exit ;;
                *)
                    echo "${red}invalid entry, try again${reset}" 
                    ;;
            esac
        done
    fi
}

function setTitle() {
    echo "${green}${bold}$1${reset} ...${reset}" && echo ""
}

function setService() {
   echo "" && echo "${green}${bold}$1${reset} ${green}$2${reset}"
}

function printStatus() {
    # stop script upon command failure
    set -e
    
    # write additional details
    echo ""
    echo "${green}$1 ...${reset}"
    echo ""
}