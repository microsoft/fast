#!/bin/bash

: 'AZURE FAST DEPLOYER
This will deploy from staging to production via Azure Web App Slot swapping. 
To revert, simply re-run, and the instances will swap back to their original 
states assuming there has been no merges into master between executions.
'
# CONFIGURATION
    source ./config.sh

# LAUNCH
    setTitle "Deploying Azure Services"
    setApplication

## EXECUTE services
    service_type="App Service"
    service_code="app"
    service_resource_group=$system-$location-rg
    service_name=$application-$location-app$env_path
    service_app_env=$application-$location-app
    

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

    title="swapping from staging to production in $resource_group"
        printStatus "$title"
        {
            az webapp deployment slot swap \
                --resource-group $resource_group \
                --name $full_app_name \
                --slot stage \
                --action swap \
                --target-slot production

        } || {
            printStatus "Error: $title"
        }

    title="purging cache on new production in $resource_group"
        printStatus "$title"
        {
            az network front-door purge-endpoint \
                --content-paths "/*" \
                --name "fast-front" \
                --resource-group "fast-global-rg"
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

