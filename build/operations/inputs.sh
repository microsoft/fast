#!/bin/bash

# Set arguments passed in from command line to overwrite the default configurations

while (( $# > 1 )); do 
    case $1 in 
        --application) 
            
            application=$2
      
            if [ $application == "ask" ];
            then
                echo "${bold}${green}Application${reset} Select an application to deploy:"
                select application in app color create explore motion www done
                do
                    
                    case $application in

                        app | color | create | explore | motion | www)
                            echo "Deploying ${bold}$application${reset} now ..."
                            application=$application ;;

                        done)
                            echo "DEPLOYMENT is finished. [Enter] Ctrl+c to quit" ;;
                        *)
                            echo "${red}invalid entry, try again${reset}" ;;
                    esac
                done
            fi ;;

        --debug)
            [[ $debug == true ]] && echo "${bold}${green}Debug"${reset} $debug
            debug=$2 ;;

        --location) 
            
            location=$2
            location_abbr=${location:0:4}
            echo "${bold}${green}Location"${reset} $location ;;

        --name)
            
            name=$2
            echo "${bold}${green}Name"${reset} $name ;;

        --product) 

            product=$2
            echo "${bold}${green}Product"${reset} $product ;;
     
        --resource-group) 
            
            resource_group=$2
            echo "${bold}${green}Resource Group"${reset} $resource_group ;;

        --subscription)
            subscription=$2
            echo "${bold}${green}Subscription"${reset} $subscription
            
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
            echo "" ;;
        *) ;;
    esac; shift 2
done