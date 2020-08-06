#!/bin/bash

: 'AZURE FAST DEPLOYING
This will deploy from staging to production via Azure Web App Slot swapping.

'

# GLOBAL Configurations
    source config.sh

    # Web App valid values
    declare -a subscriptions=("production" "development")
    declare -a locations=("west" "east")

    # Defaults
    product=fast
    subscription=production

## SHELL Arguments
    echo "${bold}${green}DEPLOYMENT started ...${reset}"
    echo "${green}Predefined defaults found${reset}" && echo ""
    source inputs.sh --debug false --subscription $subscription

## TASK Process
    echo "${bold}${green}Application${reset} Select an application to deploy:"
    status=false
    select application in app color create explore motion www exit
    do
        case $application in

            app | color | create | explore | motion | www)

                echo ""
                echo "${green}Deploying ${bold}$application${reset} ${green}now ...${reset}"
            
                for location in ${locations[@]}; do
                    status=true

                    # configure resource group and IP address
                    resource_group=fast-$location'us'-rg
                    public_ip="$(wget -qO- ipinfo.io/ip)"/16
                    [[ $debug == true ]] && echo "public IP: ${public_ip}" && echo "performing release deployment into $resource_group ..."
                    echo "${green}.. deploying into $location region started ...${reset}"

                    rule_name="Front Door IPv4 IP Testing"
                    rule_description="Allow public IP access for testing from local system"
                    new_app_name=$application-$location-app
                    echo ".. to $new_app_name instance ..."

                    echo ".. open network access for $public_ip ..."
                    echo ""
                    az webapp config access-restriction add --priority 300 \
                        --resource-group $resource_group \
                        --name $new_app_name \
                        --description "$rule_description" \
                        --rule-name "$rule_name" \
                        --action Allow \
                        --ip-address ${public_ip}

                    echo ".. swapping from staging to production in $resource_group ..."
                    #az webapp deployment slot swap --resource-group $resource_group --name $new_app_name --slot stage --action swap --target-slot production

                    echo ""
                    echo "${yellow}begin testing ..."
                    echo ".. verify website on production at http://$new_app_name.azurewebsites.net"
                    echo ".. verify files on production at https://$new_app_name.scm.azurewebsites.net/webssh/host"
                    echo ""
                    echo ".. verify website on staging at http://$new_app_name-stage.azurewebsites.net"
                    echo ".. verify files on staging at https://$new_app_name-stage.scm.azurewebsites.net/webssh/host"
                    echo "end testing ...${reset}"
                    echo ""
                    read -p ".. press [enter] key to resume if testing is complete ..."

                    az webapp config access-restriction remove -g $resource_group -n $new_app_name --rule-name "$rule_name"
                    echo ".. close network access for $public_ip ..."
                    
                    echo "${green}.. deploying into $location region finished ...${reset}"
                    echo ""

                done
                echo "${bold}${green}DEPLOYMENT finished. Continue with another?${reset}" 
                ;;

            exit)

                echo ""
                if [ status == true ];
                then
                    echo "${bold}${green}DEPLOYMENT finished.${reset}" 
                else
                    echo "${bold}${green}DEPLOYMENT cancelled.${reset}" 
                fi    
                break ;;

            *)
                echo "${red}invalid entry, try again${reset}" ;;
        esac
    done