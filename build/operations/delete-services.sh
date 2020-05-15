#!/bin/bash
source config.sh

# DELETE RESOURCE GROUP AND ALL CHILDREN SERVICES
az group delete --name $resource_group