#!/bin/bash

: 'AZURE FAST DEBUGGER
This will open network to expedite and improve troubleshooting capability across Azure Web Apps
'
# CONFIGURATION
    source ./config.sh

# LAUNCH
    setTitle "Debugging Azure Services"
    setApplication 
    
## EXECUTE services
    service_type="App Service"
    service_code="app"
    service_resource_group=$system-$location-rg
    service_name=$application-$location-app$env_path
    service_app_env=$application-$location-app

    if [[ $environment == "staging" ]];
    then                    
        service_app_env=$application-$location-app-stage
    fi

    title="retrieving public ip address"
        printStatus "$title"
        {
            public_ip="$(wget -qO- ipinfo.io/ip)"/16

            echo ". launching into $location"
            echo ". on $service_name instance"
            echo ". allowing access from $public_ip ..." && echo ""
    
        } || {
            printStatus "Error: $title"
        }

    title="creating network access for IPv4"
        printStatus "$title"
        {
            rule_name="Front Door IPv4 IP Testing"
            rule_description="Allow public IP access for testing from local system"       
            az webapp config access-restriction add --priority 300 \
                --resource-group $service_resource_group \
                --name $service_name \
                --description "$rule_description" \
                --rule-name "$rule_name" \
                --action Allow \
                --ip-address ${public_ip}

        } || {
            printStatus "Error: $title"
        }

    title="opening backend links for testing"
        printStatus "$title"
        {
            echo ""
            echo ". verify https://$service_app_env.azurewebsites.net"
            read -p ".. press [enter] key to resume if testing is complete ..."
            echo ". verify https://$service_app_env.scm.azurewebsites.net/webssh/host"
            read -p ".. press [enter] key to resume if testing is complete ..."
            echo ""
        } || {
            printStatus "Error: $title"
        }

    title="remove network access for IPv4"
        printStatus "$title"
        {
            az webapp config access-restriction remove \
                --name $service_name \
                --resource-group $service_resource_group \
                --rule-name "$rule_name"
    
        } || {
            printStatus "Error: $title"
        }

echo "${bold}${green}finished.${reset}"
