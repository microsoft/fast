#!/bin/bash

# LOGIN TO AZURE CLOUD
az login

source config.sh
source inputs.sh --subscription $subscription
