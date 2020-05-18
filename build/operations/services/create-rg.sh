#!/bin/bash

: 'AZURE RESOURCE GROUP => CREATE
For improved isolation and availability in business continuity disaster recovery (BCDR) 
regionally pair "East US" and "West US" for indepth details on paired regions.


Ref: 
https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions
https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/multi-region#regional-pairing
'
az group create --location $location --name $resource_group
