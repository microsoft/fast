#!/bin/bash

: 'AZURE FAST DEPLOYING
This will deploy from staging to production via Azure Web App Slot swapping.

'

# GLOBAL Configurations
    source config.sh

    # Web Apps: Valid values
    declare -a subscriptions=("production" "development")
    declare -a names=("app" "color" "create" "explore" "motion" "www")
    declare -a locations=("westus" "eastus")

    product=fast
    subscription=production

## SHELL Arguments
source inputs.sh --debug true --subscription $subscription

## JOBS
echo "deploying from staging to production in west region ..."
az webapp deployment slot swap --resource-group fast-westus-rg --name www-west-app --slot stage --action swap --target-slot production

echo "deploying from staging to production in east region ..."
az webapp deployment slot swap --resource-group fast-eastus-rg --name www-east-app --slot stage --action swap --target-slot production


echo "${bold}${green}Success !!!${reset}${unbold}"

