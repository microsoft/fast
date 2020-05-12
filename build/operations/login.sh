#!/bin/bash
source config.sh

# LOGIN TO AZURE CLOUD
az login

: 'SET SUBSCRIPTION
Three subscriptions exist, one for each environment, in config.sh
Choose one to reference and work with when loggin in
'
subscription=$subscription_production
[[ $debug == true ]] && echo "${bold}${green}Subscription"${reset}${unbold}
[[ $debug == true ]] && echo $subscription

# SET SUBSCRIPTION
az account set --subscription $subscription

# VERIFY SUBSCRIPTION
az account show --subscription $subscription