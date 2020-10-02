#!/bin/bash

: 'FAST CLI FUNCTIONS
Contains internal fast functions for processing Azure required logic.
'

function debugService() {
    if [[ $debug == true ]];
    then
        echo "${yellow}"
        props=$1
        for arg in "${args[@]}"
        do
            echo "${arg}"
        done
        echo "${reset}"
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
    arg=$1
    location=${arg:0:4}
}

function setRegion() {
    if [ -z "$region" ];
    then
        echo "Select an ${bold}${green}Region${reset}:"    
        select region in ${regions[@]}
        do
            case $region in
                westus | eastus)  
                    resource_group=fast-$region-rg
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