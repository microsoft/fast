#!/bin/bash

# Login to Azure Cloud
az login

# Set Default Configuration
# File is located at $AZURE_CONFIG_DIR/config and generated on first run of `$ bash login.sh`
# On Linux/MacOS: $HOME/.azure
# On Windows: %USERPROFILE%\.azure
az configure --defaults output=table disable_confirm_prompt=false enable_log_file=yes log_dir=/log/azure

# Set Subscription
# az account set --subscription "456b8669-6142-4a7b-b4a6-adf39c80289e"