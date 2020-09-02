#!/bin/bash

# Set arguments passed in from command line to overwrite the default configurations

while (( $# > 1 )); do 
    case $1 in 
        --application | -a)
            application=$2
            echo "${green}Application ${bold}$application${reset} ${green}set.${reset}" && echo "" 
            ;;

        --debug | -d)
            [[ $debug == true ]] && echo "${bold}${green}Debug"${reset} $debug
            debug=$2 ;;

        --environment | -e)
            environment=$2
            echo "${green}Environment ${bold}$environment${reset} ${green}set.${reset}" && echo ""

            case $environment in
                production | development)
                    subscription=$environment
                    environment=$environment
                    env_path=""
                    site_path=""
                    break ;;
                staging)
                    # there is no staging subscription, is's on production
                    subscription=production
                    environment=staging
                    env_path=/slots/stage
                    break ;;
            esac
            ;;

        --location | -l)             
            location=$2
            region=$2us         
            echo "${bold}${green}Location"${reset} $location ;;

        --name | -n)            
            name=$2
            echo "${bold}${green}Name"${reset} $name ;;

        --region | -r)            
            region=$2
            location=${region:0:4}
            echo "${green}Region ${bold}$region${reset} ${green}set.${reset}" && echo "" ;;
       
        --resource-group | -rg)   
            resource_group=$2
            echo "${bold}${green}Resource Group"${reset} $resource_group ;;

        --service | -s) 
            service=$2
            echo "${bold}${green}Service"${reset} $service ;;
     
        --subscription)
            subscription=$2
            echo "${green}Subscription ${bold}$subscription${reset} ${green}set.${reset}" && echo ""
            
            # Retrieve subscription from Global Azure Key Vault
            case "$subscription" in 
                production) 
                    subscription=$(az keyvault secret show --name "subscription-production" --vault-name "fast-ops-kv" --query "value" -o tsv) ;;
                development)
                    subscription=$(az keyvault secret show --name "subscription-development" --vault-name "fast-ops-kv" --query "value" -o tsv) ;;
            esac

            az account set --subscription $subscription

            if [ $debug == true ];
            then
                az account show --subscription $subscription
            fi 
            ;;
        *) ;;
    esac; shift 2
done