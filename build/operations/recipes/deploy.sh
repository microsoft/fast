#!/bin/bash

: 'AZURE FAST DEPLOYING
This will deploy from staging to production via Azure Web App Slot swapping.

'

# GLOBAL Configurations
    source config.sh

    # Web App valid values
    declare -a subscriptions=("production" "development")
    declare -a names=("app" "color" "create" "explore" "motion" "www")
    declare -a locations=("west" "east")

    # Defaults
    product=fast
    subscription=production
    application=ask

## SHELL Arguments
echo "${bold}${green}DEPLOYMENT started ...${reset}"
echo "${green}Predefined defaults found${reset}" && echo ""
source inputs.sh --debug false --subscription $subscription --application $application

exit;

## JOBS
for location in ${locations[@]}; do

    # configure resource group and IP address
    resource_group=fast-$location'us'-rg
    public_ip="$(wget -qO- ipinfo.io/ip)"/16
    echo "public IP: ${public_ip}"

    echo "performing release deployment into $resource_group ..."
    for name in ${names[@]}; do

        rule_name="Front Door IPv4 IP Testing"
        rule_description="Allow public IP access for testing from local system"
        new_app_name=$name-$location-app
        echo "deploying production server name $new_app_name ..."

        echo "configuring network access exception for testing from $public_ip ..."
        az webapp config access-restriction add --priority 300 \
            --resource-group $resource_group \
            --name $new_app_name \
            --description "$rule_description" \
            --rule-name "$rule_name" \
            --action Allow \
            --ip-address ${public_ip}

        echo "deploying from staging to production in east region ..."
        az webapp deployment slot swap --resource-group $resource_group --name $new_app_name --slot stage --action swap --target-slot production

        echo "Verify website => http://$new_app_name.azurewebsites.net"

        read -p "Press [Enter] key to resume ..."

        echo "removing network access exception for testing from $public_ip ..."
        az webapp config access-restriction remove -g $resource_group -n $new_app_name --rule-name "$rule_name"

        echo "${bold}${green}Success !!!${reset}${unbold}"
    done
done