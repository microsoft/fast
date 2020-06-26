# Azure Cloud Documentation

## Getting Started
A series of Bash scripts are provided to perform Infrastructure related tasks.

### Installation
Multiple options exist to use the Azure CLI for working with FAST Infrastructure.

Begin by [installing](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) a preferred Azure CLI.

Sign in happens interactively with Azure CLI upon executing `bash login.sh`. Leverages the security groups within the Azure tenent by launching the user into a web browser for authentication, then perfoms FAST configuration.

```bash
bash login.sh
```

When using Bash scripts it's not necessary to manually login and perform CLI commands. Each script includes detailed description, notes, and references on it's purpose organized as recipes that execute services for installation and configuration.

Experienced Azure CLI users may find it useful to perform management tasks directly using the Azure CLI as it's fast and efficient rather than relying on recipes.

### Configuration
System configuration occurs automatically upon first executing `bash login.sh` and is stored in the user's home directory.

* On Linux or MacOS it's stored at `$HOME/.azure`. To view execute `cat ~/.azure/config` on your CLI. 
* On Windows it's stored at `%USERPROFILE%\.azure`.

For additional details on [Azure CLI Configuration](https://docs.microsoft.com/en-us/cli/azure/azure-cli-configuration?view=azure-cli-latest).

### Recipes Commands
Recipes are available to perform all infrastructure actions and are ordered based on the necessary procedures to build out new infrastructure. While these scripts are suited for FAST, with slight modifications anyone with a valid Azure Subscription could quickly and easily onboard to Azure so long as they have the proper permissions to read/write/execute in the Azure Cloud.

1. Creates all resources within a region.

```bash
bash recipes/create-production.sh
```

2. Deletes all resources within a region.

```bash
bash recipes/delete-production.sh
```

### Azure CLI Commands
Azure Cloud includes a comprehensive SDK accessible with Azure PowerShell (Windows) or FAST's preference for Azure CLI (MacOS/Linux) to simplify Azure Resource Management.

![Web Architecture](diagrams/consistent-management-layer.png)
_Fast Azure Resource Managment_

#### Deletion
Configuration management requires frequent build up and tear down procedures against Azure Cloud resources during development and testing. This command safely deletes the entire resource group and all resources that reside within.

This is an intentionally manual process that uses the interactive shell for added protection and safety from harming any existing infrastructure.

For beginners, it's recommended to ensure you're using a development or testing subscription before experimentating with Azure CLI, to limit irreparable damage to production resources.

```bash
az group delete --name "some-resource-group-name"
```

## Architecture
FAST uses Azure Cloud Infrasture and Platform as a Service for highly available multi-regional web applications.

This architecture uses an active/passive with hot standby approach. Meaning the primary regions is receives all traffic, while the other region awaits on hot standby. Hot standby means the VMs in the secondary region are allocated and running at all times.

Learn more from [Azure Documentation](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/multi-region).

![Web Architecture](diagrams/multi-region-web-app-diagram.png)
_Fast Production Subscription_

### Naming Standards
Follow all naming standards from https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging with the one exception, suffics instead of prefix. For example `rg-` is the recommendation. However, choose `-rg` instead to allow for product / area groupings considering that the Azure Portal already has a column for Resource Type.

* Always use lower case letters
* Prepend with the product name, example: "fast"
* Append the Azure Service with the first letters of each service type, example: "as", would be used for App Service
* Append with random number from 1-9, example, fast-as-1
* When services dictate, it's ok to deviate from this naming

### Organizational Structure
This hierarchy uses the Workload separation strategy. 

* Fast Design Management Group
  * Production Management Group
    * Fast Production
      * Front Door West US
      * Active Resource Group (Primary Region - West US)  
      * Standby Resource Group (Secondary Region - East US)
      * Back Door East US
  * Development Management Group
    * Fast Development
      * Front Door West US
      * Active Resource Group (Primary Region - West US)  
      * Standby Resource Group (Secondary Region - East US)
      * Back Door East US

**staging slots are used to manage pre-production smoke testing.


### Front Door
This is considered a global resource and a type of Application Delivery Network (ADN) as a service, offering load-balancing capabilities for global routing to applications across availability regions using active/passive with hot standby approach. Performance is improved with dynamic site acceleration. Full end-to-end encyrption is achieved using TLS/SSL offloading. Configuration changes to Front Door, are deployed across all POPs globally in 3 to 5 minutes. Any updates to the backend pools are seamless and cause zero downtime when configured correctly. For greater scale as traffic increases immensely, we could implement an Azure Load Balance behind Front Door.

Front Door is a globally distributed multi-tenant platform with huge volumes of capacity to cater to your application's scalability needs. Delivered from the edge of Microsoft's global network, Front Door provides global load balancing capability that allows you to fail over your entire application or even individual microservices across regions or different clouds.

The FAST Front Door will perform caching for web files.

#### Limitations
Front Door does not support using Azure Active Directory for more than one Web App running in the same backend pool. It creates a round robin issue bouncing between services eventually failing the request. This limitation was discovered on staging sites which use Azure Active Directory.

* Front Door does not support using Response rewriting

The work around is to disable the web app in the passive region and add a custom domain name for the staging slot with http as the probing protocol. Validation of the custom domain can be accomplished with DNS TXT records. Application Gateway has this capability. A new feature request has been sent to Azure Front Door.

* Front Door is limited to 100 resources per subscription, 50 backend pools per resource, and 100 backends per back-end pool. 
* MIME Types: There are certain limitations on fonts, images, an data files.

For additional limitations visit [details](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-service-limits) https://docs.microsoft.com/en-us/azure/frontdoor/front-door-caching


#### Risks
* Failure Points: Front Door is a possible failure point in the system. If the service fails, clients cannot access your application during the downtime. Review the Front Door service level agreement (SLA) and determine whether using Front Door alone meets your business requirements for high availability. If not, consider adding another traffic management solution as a fallback. If the Front Door service fails, change your canonical name (CNAME) records in DNS to point to the other traffic management service. This step must be performed manually, and your application will be unavailable until the DNS changes are propagated.

* Certification Autorotation: For our custom TLS/SSL certificate, autorotation isn't supported and must setup new prior to expiration, and updated across Key Vaults and backend microservices. Updates to certifictes is atomic and does not cause any downtime.


### Resource Groups / Locations
For improved isolation and availability in business continuity disaster recovery (BCDR) regionally pairing is used.

### Key Vault
FAST uses one Key vault per environment (development, staging, and production) for an additional layer of security. If one environment is compromised, others remain safe. Key Vault, takes backups on regular cadence as objects stored within the Key Vault change.  Subscriptions are stored in Azure Key Vault retrievable using Azure CLI, for authorized administrators only.

### Storage
Uses read-access geo-redundant storage (RA-GRS), where the data is replicated to a secondary region. You have read-only access to the data in the secondary region through a separate endpoint. If there is a regional outage or disaster, the Azure Storage team might decide to perform a geo-failover to the secondary region. There is no customer action required for this failover.

### Azure CDN
For Azure CDN Standard from Microsoft profiles, propagation usually completes in 10 minutes.  If you're setting up compression for the first time for your CDN endpoint, consider waiting 1-2 hours before you troubleshoot to ensure the compression settings have propagated to the POPs. 

FAST CDN, leverages Blob Storage to cache infrequently updated application assets (logos, images, fonts, etc). This technique has greater durability, though does require more maintenance as assets must be deployed separately from Web Applications.

In code, GitHub Actions pulls assets from within `/site-utilities/statics/assets`. Any site that has CDN dependencies, should store these files in this folder. These files are deployed to the CDN upon `push` to `master` from any daily pull request. CDN resources can be referenced using `https://static.fast.design/assets/` matching the folder name in source code. For example, `https://static.fast.design/assets/cdn-test.png`.

### Building for Resiliency
https://docs.microsoft.com/en-us/azure/architecture/framework/resiliency/overview


## Log Analytics Reporting
To query Front Door metics and diagnostics on WAP run on Azure Log Analytics:

```bash
AzureDiagnostics
| where ResourceType == "FRONTDOORS" and Category == "FrontdoorWebApplicationFirewallLog"
| where action_s == "Block"
```

## Troublshooting

### Status
Azure Status https://status.azure.com/en-us/status
