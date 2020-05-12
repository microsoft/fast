#!/bin/bash
source config.sh

# LOGIN TO AZURE CLOUD
az login

<<COMMENT Set Subscription
Three subscriptions exist, one for each environment, in config.sh
Choose one to reference and work with when loggin in
COMMENT
subscription = subscription_production
az account set --subscription $subscription

# Confirm Current Subscription
az account show --subscription $subscription