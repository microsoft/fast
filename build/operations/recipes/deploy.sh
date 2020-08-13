#!/bin/bash

: 'AZURE FAST DEPLOYING
This will deploy from staging to production via Azure Web App Slot swapping.

'
# TODOs
# [] if deployment fails, add revert logic. Probably easiest to include as another select option. [Y] to resume (default), [N] to cancel, [R] to revert.

# GLOBAL Configurations
    source config.sh

    # Web App valid values
    declare -a subscriptions=("production" "development")
    declare -a locations=("west" "east")
    product=fast
    status=false

## CONFIG Options
    echo "${bold}${green}DEPLOYMENT started ...${reset}"
    echo "${green}Predefined defaults found${reset}" && echo ""
    echo "Select an ${bold}${green}Environment${reset}:"
    select environment in production staging development exit
    do
        case $environment in
            production)
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
             development)
                # sandbox to freely create and destroy services with scripts
                subscription=development
                environment=development
                env_path=
                break ;;
            exit)
                echo "${bold}${green}DEPLOYMENT cancelled.${reset}" 
                exit ;;
            *)
                echo "${red}invalid entry, try again${reset}" ;;
        esac
    done
    echo "${green}Environment ${bold}$environment${reset} ${green}set ...${reset}"
    echo ""

## SHELL Arguments
    source inputs.sh --debug false --subscription $subscription

## TASK Process
    echo "${bold}${green}Application${reset} Select an application to deploy:"
    select application in app color create explore motion www exit
    do
        case $application in

            app | color | create | explore | motion | www)

                echo ""
                echo "${green}Deploying ${bold}$application${reset} ${green}now ...${reset}"
            
                for location in ${locations[@]}; do
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
                    az webapp deployment slot swap --resource-group $resource_group --name $new_app_name --slot stage --action swap --target-slot production

                    echo ""
                    echo "${yellow}begin testing ..."
                    echo ".. verify website on production at https://$new_app_name.azurewebsites.net"
                    echo ".. verify files on production at https://$new_app_name.scm.azurewebsites.net/webssh/host"
                    echo ""
                    echo ".. verify website on staging at https://$new_app_name-stage.azurewebsites.net"
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
                echo "${bold}${green}DEPLOYMENT cancelled.${reset}" 
                exit ;;

            *)
                echo "${red}invalid entry, try again${reset}" ;;
        esac
    done
echo "${bold}${green}DEPLOYMENT finished.${reset}" 
