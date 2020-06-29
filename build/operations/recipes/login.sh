#!/bin/bash

# LOGIN TO AZURE CLOUD
az login

source config.sh
source inputs.sh --subscription $subscription

echo "You were automatically logged into ..."
az account show