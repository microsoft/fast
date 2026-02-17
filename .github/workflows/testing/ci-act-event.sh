#!/bin/bash

echo " ------------------------------------------------------------------------------------------------ "
echo "| This script will dynamically create an event.json file for use by Nektos/Act in testing GitHub  |"
echo "| Actions locally.                                                                                |"
echo " -------------------------------------------------------------------------------------------------"

# Ask for Branch Name
echo -n "Enter git branch name?    "
read branch_name

# Ask for Event Type
echo -n "Enter the GitHub Event to trigger the GitHub Action?    "
read github_event

# Combine user inputs into the json template
# Set contents of the file to be overwritten
echo '{
    "push": {
      "head": {
        "ref": "'$branch_name'"
      },
      "base": {
        "ref": "'$branch_name'"
      }
    }
  }' >& $github_event.json

