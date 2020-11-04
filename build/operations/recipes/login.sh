#!/bin/bash

: 'AZURE FAST LOGIN
Execute login to begin using Azure FAST CLI
'

# EXECUTE services
az login

# CONFIGURATION
    source ./config.sh
    source ./inputs.sh --subscription $subscription

title="You were automatically logged into:"
    printStatus "$title"
    {
        az account show
    } || {
        printStatus "Error: $title"
    }    