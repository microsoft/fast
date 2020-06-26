#!/bin/bash

: 'AZURE APP REGISTRATION
This enabled Azure Active Directory used for locking down access to staging pre-production
websites. 

Note: 

Ref:

'
# TODOs
# [] Script creation in the following steps
# [] Name: "FAST Staging Sites"
# [] Upload new logo: Point to logo on CDN
# [] Home page URL: https://www.fast.design
# [] TOS URL: https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx
# [] Privacy URL: https://privacy.microsoft.com/en-US/privacystatement
# [] Publisher domain 
    # [] https://www.fast.design
    # [] create file named "microsoft-identity-association.json"
    # []    # {
            # "associatedApplications": [
            #     {
            #     "applicationId": "f19c181e-91ad-434e-a621-35a00e662380"
            #     }
            # ]
            # }
# [] Host the file https://www.fast.design/.well-known/microsoft-identity-association.json
# [] Grant Admin Consent through