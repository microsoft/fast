#!/bin/bash

: 'AZURE APP SERVICE PLAN => DELETION
The Platform as a Service offering for Azure that is the container for hosting Web Apps, 
API Apps, Mobile Apps, and Function Apps. Think of this similar to an web farm of virtual
servers where you only have to manage the application framework and data.

Ref:
https://app.pluralsight.com/course-player?clipId=9b58df17-fdf9-4802-bbc4-40ea42a83655
'

az appservice plan delete --name $app_service_plan --resource-group $resource_group