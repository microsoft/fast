#!/bin/bash

# Set arguments passed in from command line
while (( $# > 1 )); do 
    case $1 in 
        --debug)
            
            debug=$2 ;;

        --location) 
            
            #Overwrite default
            location=$2
            [[ $debug == true ]] && echo "${bold}${green}Location"${reset}${unbold} && echo $location ;;

        --name)
            
            #Overwrite default
            name=$2
            [[ $debug == true ]] && echo "${bold}${green}Name"${reset}${unbold} echo $name ;;

        --product) 

            #Overwrite default
            product=$2
            [[ $debug == true ]] && echo "${bold}${green}Product"${reset}${unbold} && echo $product ;;

     
        --resource-group) 
            
            # Overwrite default
            resource_group=$2
            [[ $debug == true ]] && echo "${bold}${green}Resource Group"${reset}${unbold} && echo $resource_group ;;

        --subscription)
            [[ $debug == true ]] && echo "${bold}${green}Subscription"${reset}${unbold} && echo $2
            
            # Retrieve subscription from Global Key Vault
            case "$2" in 
                production) 
                    subscription=$(az keyvault secret show --name "subscription-production" --vault-name "fast-ops-kv" --query "value" -o tsv) ;;
                development)
                    subscription=$(az keyvault secret show --name "subscription-development" --vault-name "fast-ops-kv" --query "value" -o tsv) ;;
            esac
            
            az account set --subscription $subscription
            az account show --subscription $subscription ;;

        *) ;;
    esac; shift 2
done

