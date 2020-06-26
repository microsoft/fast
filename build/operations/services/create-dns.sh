#!/bin/bash

: 'AZURE NETWORK DNS ZONE 
Azure DNS is a hosting service for DNS domains that provides name resolution by using Microsoft Azure infrastructure. 
By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and 
billing as your other Azure services.

Ref:
https://docs.microsoft.com/en-us/azure/dns/
https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-cli
https://docs.microsoft.com/en-us/azure/frontdoor/front-door-how-to-onboard-apex-domain
https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-cli#create-a-dns-record
'

# TODOs
# [] Create DNS Zone for development and testing
# [] Update all entries unrelated to web app dynamic creation
# [] Gracefull fail if not in use

echo "creating dns zone ..."
az network dns zone create --resource-group $resource_group -n $dns_zone

echo "creating dns cname records"
az network dns record-set cname add-record -g $resource_group -z $dns_zone -n www -a 10.10.10.10

echo "view dns records ..."
az network dns record-set list -g $resource_group -z $dns_zone
