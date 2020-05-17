#!/bin/bash
source config.sh

# Set arguments passed in from command line
while (( $# > 1 )); do 
    case $1 in 
        --debug)
            echo "Debug set: $2"
            debug=$2 ;;

        --location) 
            echo "Location set: $2"

            # Keep configured default
            location=$2
            
            [[ $debug == true ]] && echo "${bold}${green}Location"${reset}${unbold} && echo $location ;;

        --name)
            echo "Front Door name set: $2"
            
            #Overwrite default
            name=$2

            [[ $debug == true ]] && echo "${bold}${green}Name"${reset}${unbold} echo $front_door ;;

        --product) 
            echo "Product set: $2"

            #Overwrite default
            product=$2
            
            [[ $debug == true ]] && echo "${bold}${green}Product"${reset}${unbold} && echo $product ;;

     
        --resource-group) 
            echo "Resource group set: $2"
            
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
            
            az account set --subscription $subscription ;;

        *) ;;
    esac; shift 2
done

