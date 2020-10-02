#!/bin/bash

: 'FAST CLI ARGUMENTS
Set global variables passed in as input parameters overwriting initial launch configurations.
'

while (( $# > 1 )); do 
    case $1 in 
        --application | -a)
            application=$2
            echo "${green}Application ${bold}$application${reset} ${green}set.${reset}" && echo "" 
            ;;

        --debug | -d)
            debug=$2 
            debugSystem
            ;;

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
            echo "${green}Location ${bold}$location${reset} ${green}set.${reset}" && echo ""
            ;;
  
        --name | -n)            
            name=$2
            echo "${green}Name ${bold}$name${reset} ${green}set.${reset}" && echo ""
            ;;
        
        --region | -r)            
            region=$2
            echo "${green}Region ${bold}$region${reset} ${green}set.${reset}" && echo ""
            ;;
       
        --resource-group | -rg)   
            resource_group=$2
            echo "${green}Resource Group ${bold}$resource_group${reset} ${green}set.${reset}" && echo ""
            ;;

        --service | -s) 
            service=$2
            echo "${green}Service ${bold}$service${reset} ${green}set.${reset}" && echo ""
            ;;
     
        --subscription | -s)
            subscription=$2
            echo "${green}Subscription ${bold}$subscription${reset} ${green}set.${reset}"
            
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
            echo "" 
            ;;
        *) ;;
    esac; shift 2
done