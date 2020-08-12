#!/bin/bash

: 'AZURE FAST TEST
Enables access to west region to perform maintenance, tuning, and testing of staging servers. Upon
completion, disables access and resumes normal operations.
'
# TODOs

# GLOBAL Configurations
    source config.sh

    # Web App valid values
    declare -a subscriptions=("production" "development")
    declare -a locations=("west" "east")
    product=fast
    
## CONFIG Options
    echo "${bold}${green}TESTING started ...${reset}"
    echo "${green}Predefined defaults found${reset}" && echo ""
    echo "Select an ${bold}${green}Environment${reset}:"
    select environment in production staging development exit
    do
        case $environment in
            production)
                subscription=$environment
                environment=$environment
                env_path=""
                break ;;
            staging | development)
                # there is no staging subscription, so use development
                subscription=development
                environment=staging
                env_path=/slots/stage
                break ;;
            exit)
                break ;;
            *)
                echo "${red}invalid entry, try again${reset}" ;;
        esac
    done
    echo "${green}Environment ${bold}$environment${reset} ${green}set ...${reset}"
    echo ""

## SHELL Arguments
   source inputs.sh --debug false --subscription $subscription

## TASK Process
    status=false
    echo "Select an ${bold}${green}Application${reset}:"
    select application in app color create explore motion www exit
    do
        case $application in

            app | color | create | explore | motion | www)

                echo "${green}Application ${bold}$application${reset} ${green}set ...${reset}"
                echo ""

                for location in ${locations[@]}; do
                    status=true

                    # configure resource group and IP address
                    resource_group=fast-$location'us'-rg
                    public_ip="$(wget -qO- ipinfo.io/ip)"/16
                    [[ $debug == true ]] && echo "public IP: ${public_ip}" && echo "performing testing into $resource_group ..."
                    echo ".. start testing on $location region ..."

                    rule_name="Front Door IPv4 IP Testing"
                    rule_description="Allow public IP access for testing from local system"
                    new_app_name=$application-$location-app$env_path
                    echo ".. for $new_app_name instance ..."

                    echo ".. open network access for $public_ip ..."
                    echo ""
                    az webapp config access-restriction add --priority 300 \
                        --resource-group $resource_group \
                        --name $new_app_name \
                        --description "$rule_description" \
                        --rule-name "$rule_name" \
                        --action Allow \
                        --ip-address ${public_ip}

                    echo ""
                    echo "begin testing ..."
                    if [ $environment == "production" ];
                    then
                        echo ".. verify website on production at https://$new_app_name.azurewebsites.net"
                        echo ".. verify files on production at https://$new_app_name.scm.azurewebsites.net/webssh/host"
                    fi                    
                    if [ $environment == "staging" ];
                    then                    
                        echo ".. verify website on staging at https://$new_app_name-stage.azurewebsites.net"
                        echo ".. verify files on staging at https://$new_app_name-stage.scm.azurewebsites.net/webssh/host"
                    fi
                    echo "end testing ..."
                    echo ""
                    read -p ".. press [enter] key to resume if testing is complete ..."

                    az webapp config access-restriction remove -g $resource_group -n $new_app_name --rule-name "$rule_name"
                    echo ".. close network access for $public_ip ..."
                    
                    echo ".. testing on $location region finished ..."
                    echo ""
                    echo "${green}----- next region -----${reset}"
                    echo ""
                done
                echo "${bold}${green}TESTING finished. Continue with another?${reset}" 
                ;;

            exit)

                echo ""
                if [ status == true ];
                then
                    echo "${bold}${green}TESTING finished.${reset}" 
                else
                    echo "${bold}${green}TESTING cancelled.${reset}" 
                fi    
                break ;;

            *)
                echo "${red}invalid entry, try again${reset}" ;;
        esac
    done