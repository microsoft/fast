#!/bin/bash

: 'SET DEFAULT CONFIGURATION
File is located at $AZURE_CONFIG_DIR/config and generated on first run of `$ bash login.sh`
* On Linux/MacOS: $HOME/.azure
* On Windows: %USERPROFILE%\.azure
'
az configure --defaults output=table disable_confirm_prompt=false enable_log_file=yes log_dir=/log/azure

# COMMON TERMINAL CONFIGURATIONS
red=$(tput setaf 1) 
green=$(tput setaf 2) 
reset=$(tput sgr0) 
bold=$(tput smso)
unbold=$(tput rmso)

# SET COMMON VARIABLES
debug=true
dir=$(PWD)

# Requirements
echo "Scripts are required to run from inside 'fast-dna/build/operations'"