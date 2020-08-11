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
    declare -a locations=("west")

    # Defaults
    product=fast
    subscription=production

## SHELL Arguments
    echo "${bold}${green}TESTING started ...${reset}"
    echo "${green}Predefined defaults found${reset}" && echo ""
    source inputs.sh --debug false --subscription $subscription

## TASK Process
    echo "${bold}${green}Application${reset} Select an application to test:"
    status=false
    select application in app color create explore motion www exit
    do
        case $application in

            app | color | create | explore | motion | www)

                echo ""
                echo "${green}Testing ${bold}$application${reset} ${green}now ...${reset}"
            
                for location in ${locations[@]}; do
                    status=true

                    # configure resource group and IP address
                    resource_group=fast-$location'us'-rg
                    public_ip="$(wget -qO- ipinfo.io/ip)"/16
                    [[ $debug == true ]] && echo "public IP: ${public_ip}" && echo "performing testing into $resource_group ..."
                    echo "${green}.. testing on $location region started ...${reset}"

                    rule_name="Front Door IPv4 IP Testing"
                    rule_description="Allow public IP access for testing from local system"
                    new_app_name=$application-$location-app
                    echo ".. to $new_app_name instance ..."

                    echo ".. open network access for $public_ip ..."
                    echo ""
                    az webapp config access-restriction add --priority 300 \
                        --resource-group $resource_group \
                        --name $new_app_name/slots/stage \
                        --description "$rule_description" \
                        --rule-name "$rule_name" \
                        --action Allow \
                        --ip-address ${public_ip}

                    echo ""
                    echo "${yellow}begin testing ..."
                    echo ".. verify website on staging at https://$new_app_name-stage.azurewebsites.net"
                    echo ".. verify files on staging at https://$new_app_name-stage.scm.azurewebsites.net/webssh/host"
                    echo "end testing ...${reset}"
                    echo ""
                    read -p ".. press [enter] key to resume if testing is complete ..."

                    az webapp config access-restriction remove -g $resource_group -n $new_app_name --rule-name "$rule_name"
                    echo ".. close network access for $public_ip ..."
                    
                    echo "${green}.. testing on $location region finished ...${reset}"
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