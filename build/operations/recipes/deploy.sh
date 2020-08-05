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

## JOBS
for location in ${locations[@]}; do

    # configure resource group and IP address
    resource_group=fast-$location'us'-rg
    public_ip="$(wget -qO- ipinfo.io/ip)"/16
    [[ $debug == true ]] && echo "public IP: ${public_ip}" && echo "performing release deployment into $resource_group ..."

    echo "${bold}${green}Application${reset} Select an application to deploy:"
    select application in app color create explore motion www exit
    do
        case $application in

            app | color | create | explore | motion | www)

                echo ""
                echo "Deploying ${bold}$application${reset} now ..."
            
                rule_name="Front Door IPv4 IP Testing"
                rule_description="Allow public IP access for testing from local system"
                new_app_name=$application-$location-app
                echo ". to $new_app_name instance ..."

                echo ". open network access for $public_ip ..."
                az webapp config access-restriction add --priority 300 \
                    --resource-group $resource_group \
                    --name $new_app_name \
                    --description "$rule_description" \
                    --rule-name "$rule_name" \
                    --action Allow \
                    --ip-address ${public_ip}

                echo ".. swapping from staging to production in $resource_group ..."
                #az webapp deployment slot swap --resource-group $resource_group --name $new_app_name --slot stage --action swap --target-slot production

                echo ".. test to verify website at http://$new_app_name.azurewebsites.net"

                read -p ".. press [enter] key to resume ..."

                echo ".. close network access for $public_ip ..."
                az webapp config access-restriction remove -g $resource_group -n $new_app_name --rule-name "$rule_name"
                
                echo "${bold}${green}Deployment succeeded !!!${reset}${unbold}"
                echo ""
                    
                break
                ;;
            exit)
                echo "DEPLOYMENT finished." 
                break
                ;;
            *)
                echo "${red}invalid entry, try again${reset}" ;;
        esac
    done
done