#!/bin/bash

: 'AZURE FAST DEBUGGER
This will open network to expedite and improve troubleshooting capability across Azure Web Apps

'
# CONFIGURATION
    source ./config.sh

# LAUNCH
echo "${green}FAST Debugger - starting ${bold}$application${reset} ${green}now ...${reset}"

## SERVICE
 
    # configure resource group, location, and app service name
    resource_group=fast-$region-rg
    full_app_name=$application-$location-app$env_path
    
    if [ $environment == "staging" ];
    then                    
        full_app_url=$application-$location-app-stage
    else
        full_app_url=$application-$location-app
    fi

    # configure public ip address
    public_ip="$(wget -qO- ipinfo.io/ip)"/16
    [[ $debug == true ]] && echo "public IP: ${public_ip}" && echo "performing release deployment into $resource_group ..."
    
    echo ".. launching into $region region ..."
    echo ".. on $full_app_name instance ..."
    echo ".. allowing access from $public_ip ..." && echo ""
    
    # create network access for IPv4
    rule_name="Front Door IPv4 IP Testing"
    rule_description="Allow public IP access for testing from local system"       
    az webapp config access-restriction add --priority 300 \
        --resource-group $resource_group \
        --name $full_app_name \
        --description "$rule_description" \
        --rule-name "$rule_name" \
        --action Allow \
        --ip-address ${public_ip}

    # provide quick links for testing
    echo ""
    echo "begin testing ..."
    echo ".. verify https://$full_app_url.azurewebsites.net"
    echo ".. verify https://$full_app_url.scm.azurewebsites.net/webssh/host"
    echo "end testing ..."
    echo ""
    read -p ".. press [enter] key to resume if testing is complete ..."

    # remove access restriction
    az webapp config access-restriction remove -g $resource_group -n $full_app_name --rule-name "$rule_name"
    echo ".. close network access for $public_ip ..."
    echo "${bold}${green}finished.${reset}"
