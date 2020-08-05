#!/bin/bash

: 'SET DEFAULT CONFIGURATION
File is located at $AZURE_CONFIG_DIR/config and generated on first run of `$ bash login.sh`
* On Linux/MacOS: $HOME/.azure
* On Windows: %USERPROFILE%\.azure
'
az configure --defaults output=table disable_confirm_prompt=false enable_log_file=yes log_dir=/log/azure

# COMMON TERMINAL CONFIGURATIONS
black=$(tput setaf 0)
red=$(tput setaf 1) 
green=$(tput setaf 2)
yellow=$(tput setaf 3)
blue=$(tput setaf 4)
magenta=$(tput setaf 5)
cyan=$(tput setaf 6)
white=$(tput setaf 7)
white_f=$(tput setab 7)
standout=$(tput smso)
bold=$(tput bold)
blink=$(tput blink)
reset=$(tput sgr0) 

# SET COMMON VARIABLES
debug=false
dir=$(PWD)

# Requirements
echo "${bold}${magenta}FAST AZURE OPERATIONS CLI"${reset}
echo "${bold}${magenta}Scripts are required to run from inside 'fast/build/operations'"${reset}
echo ""