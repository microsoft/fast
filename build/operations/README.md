# Azure Cloud Documentation

## Getting Started
A series of Bash scripts are provided to perform infrastructure related tasks and require execution from within the `./build/operations` folder.

### Installation
Multiple options exist to use the Azure CLI for working with FAST Infrastructure.

Begin by [installing](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) the preferred Azure CLI.

Sign in interactively happens when using Azure CLI upon executing `bash recipes/login.sh` and leverages the security groups within the Azure tenant by launching the user into a web browser for authentication, then performs FAST configuration.

```bash
bash recipes/login.sh
```

When using FAST Bash scripts it's not necessary to manually login and perform CLI commands. Each script documents its purpose organized as recipes that execute services for installation, configuration, and maintenance tasks.

Experienced Azure CLI users may find it useful to perform management tasks directly using the Azure CLI rather than relying on FAST recipes.

### Configuration
System configuration occurs automatically upon first executing `bash recipes/login.sh` and is stored in each user's home directory.

* On Linux or MacOS it's stored at `$HOME/.azure`. To view execute `cat ~/.azure/config` on your CLI. 
* On Windows it's stored at `%USERPROFILE%\.azure`.

For additional details on [Azure CLI Configuration](https://docs.microsoft.com/en-us/cli/azure/azure-cli-configuration?view=azure-cli-latest).

### Recipes Commands
Recipes are available for performing most infrastructure actions. While these scripts are suited for FAST, with slight modifications anyone with a valid Azure Subscription could quickly and easily onboard to Azure so long as they have the proper permissions to read/write/execute in the Azure Cloud.

For a complete list of recipes review each file inside `./build/operations/recipes`.

### Azure CLI Commands
Azure Cloud includes a comprehensive SDK accessible using Azure PowerShell (Windows) or Azure CLI (MacOS/Linux) to streamline Azure Resource Management.

![Web Architecture](diagrams/consistent-management-layer.png)
_Fast Azure Resource Management_

#### Deletion
Configuration management requires frequent build up and tear down procedures against Azure Cloud resources during development and testing. This command safely deletes the entire resource group and all resources that reside within.

This is an intentionally manual process that uses the interactive shell for added protection and safety from harming any existing infrastructure.

For beginners, it's recommended to use a development or testing subscription before experimenting with Azure CLI, to limit irreparable damage to production resources.

Three resources groups are used by FAST:
1. fast-westus-rg
2. fast-eastus-rg
3. fast-ops-rg

```bash
az group delete --name "some-resource-group-name"
```

## Architecture
FAST uses Azure Cloud's Platform as a Service for highly available multi-regional web applications.

This architecture uses an active/passive with hot standby approach. Meaning the primary regions is receives all traffic, while the other region awaits on hot standby.  If the primary region fails for any reason, the secondary region picks up the load. With hot standby the secondary region allocated and running at all times. App Services uses staging slots for pre-production testing.

For improved isolation and availability in business continuity disaster recovery (BCDR) regionally pairing is used.

Learn more from [Azure Documentation](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/app-service-web-app/multi-region).

![Web Architecture](diagrams/multi-region-web-app-diagram.png)
_Fast Production Subscription_

FAST aims to serve optimized web traffic through extensive use of caching across several different services and application layers. There are two compression methods. Using middleware, for example in Express when running on Node, or using a Reverse Proxy, for example a load balancer or web server (iis, apache, nginx).

Brotli (br) is a newer compression algorithm that aims to further improve compression ratios, which can result in even faster page loads. It is compatible with the latest versions of most browsers. When requests support multiple compression types, Brotli takes precedence. 

All traffic enters through AFD (Azure Front Door) used for traffic management, load balancing, failover, and dynamic acceleration with caching. AFD has the ability to cache all requests for a duration of 1-3 days which is dynamically and randomly assigned. There is a purge feature, which allows cache busting, for releasing and deployments.  With AFD caching, no traffic requests are sent to the backend Azure Web Apps, drastically improving page load performance through reduced network latency.

All FAST websites are build on Azure Web Apps for Linux, running NodeJS technology stack with Express middleware. The Helmet package is installed for security protection. Express uses file caching for 3 days. This works because webpack hashes all website files into a bundles folder. When new files are released and new requests are made, cache is automatically broken and re-issued. 

All websites serve assets such as images, scripts, and other media files from Azure CDN located on https://static.fast.design/assets. These files are automatically deployed based on changes to source code located in `./sites/site-utilities/statics/*`. When a requested asset specifies `gzip` compression, the request returns the cached file, when not found, Azure CDN performs Gzip compression directly on the POP server.

Any file not cached internally by the web app, CDN, are cached on Azure Front Door.

### Organizational Structure
This hierarchy uses the Workload Separation strategy involving management groups. 

* Fast Design Management Group
    * Fast Production
      * Active Resource Group (Primary Region - West US)  
      * Global Operations Resource Group (non-regional specific)
      * Standby Resource Group (Secondary Region - East US)
    * Fast Development
      * Active Resource Group (Primary Region - West US)  
      * Global Operations Resource Group (non-regional specific/dependent)
      * Standby Resource Group (Secondary Region - East US)

### Front Door
This is considered a global resource and a type of Application Delivery Network (ADN) as a service, offering load-balancing capabilities for global routing to applications across availability regions using active/passive with hot standby approach. Performance is improved with dynamic site acceleration. Full end-to-end encryption is achieved using TLS/SSL offloading with auto-rotating certificates. Configuration changes to Front Door, are deployed across all POPs globally in 3 to 5 minutes. Any updates to the backend pools are seamless and cause zero downtime. For greater scale as traffic increases, we may implement an Azure Load Balance behind Front Door.

Front Door is a globally distributed multi-tenant platform with huge volumes of capacity to cater to each applications scalability needs. Delivered from the edge of Microsoft's global network, Front Door provides global load balancing capability that allows you to fail over your entire application or even individual micro-services across regions or different clouds. The Front Door service provides faster failover support because Front Door is a reverse proxy and sits on the network between the customer and your backend services. As a reverse proxy, Front Door offers additional features that Traffic Manager cannot provide.

The FAST Front Door will perform caching and dynamic content acceleration. Front Door can cache your static content and directly return cached assets to your customers without a trip to your backend further reducing latency.

#### Limitations
Several limitations exist between Azure Front Door and Azure Active Directory (AAD).

* Front Door does not support using Response rewriting
* MIME Types: There are certain limitations on fonts, images, an data files.

For additional limitations visit [details](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-front-door-service-limits) https://docs.microsoft.com/en-us/azure/frontdoor/front-door-caching

_Note_ that Application Gateway has this capability. A new feature request has been sent to Azure Front Door.

**Issue**
We use Front Door to route traffic between two regions for web traffic across multiple subdomains.  We have subdomains for https://stage.www.fast.design, for example, that we want to protect behind AAD.  This works great when configuring AAD Reply URLs to match the backend server name/url.  In this example, https://www-west-app.azurewebsites.net//.auth/login/aad/callback.  However, we want users to return back to the original URL of https://stage.www.fast.design not the backend URL.  

How can this be achieved through the Azure Portal, not web app code?

**Cause**
- Issue happens because of URL string within one of the parameters of the HTTP redirect pointing to AAD, which then uses such parameter for redirecting the user accordingly.
- Such URL was the one configured on the WebApp.

**Resolution**
- We managed to configure custom domain on both the WebApp and FrontDoor, so they both listen on same hostname. Such Hostname or FQDN, would CNAME to FrontDoor's domain.
- This custom domain was now used on the URL string within the AAD redirect so would work as expected. Nevertheless, since such AAD module responds with 302 to every unauthenticated user-agent, the FrontDoor probes would mark backend as unhealthy:

https://docs.microsoft.com/en-us/azure/frontdoor/front-door-health-probes

- When having multiple backends, it would round-robin requests, making it unusable.
- Usually a dummy path is setup in application for the 200 OK probes, but verified with AppServices it cannot be made with the pre-built AAD authentication module. To customize AAD, it's then suggested to implement it a code.

- This scenario doesn't happen with AppGW, since it can just re-write the URL parameter and also allow non-200 OK health responses.

#### Risks
* Failure Points: Front Door is a possible failure point in the system. If the service fails, clients cannot access your application during the downtime. Review the Front Door service level agreement (SLA) and determine whether using Front Door alone meets your business requirements for high availability. If not, consider adding another traffic management solution as a fallback. If the Front Door service fails, change your canonical name (CNAME) records in DNS to point to the other traffic management service. This step must be performed manually, and your application will be unavailable until the DNS changes are propagated.

### Key Vault
FAST uses one Key vault per environment (development, staging, and production) for an additional layer of security. If one environment is compromised, others remain safe. Key Vault, takes backups on regular cadence as objects stored within the Key Vault change.  Subscriptions are stored in Azure Key Vault retrievable using Azure CLI, for authorized administrators only.

### Storage
Read-access geo-redundant storage (RA-GRS) is used, where the data is replicated to a secondary region. You have read-only access to the data in the secondary region through a separate endpoint. If there is a regional outage or disaster, the Azure Storage team might decide to perform a geo-failover to the secondary region. There is no customer action required for this failover.

### Azure CDN
For Azure CDN Standard from Microsoft profiles, propagation usually completes in 10 minutes. If you're setting up compression for the first time for your CDN endpoint, consider waiting 1-2 hours before you troubleshoot to ensure the compression settings have propagated to the POPs. 

FAST CDN, leverages Blob Storage to cache infrequently updated application assets (logos, images, fonts, etc). This technique has greater durability, though does require more maintenance as assets must be deployed separately from Web Applications.

In code, GitHub Actions pulls assets from within `/site-utilities/statics/assets`. Any site that has CDN dependencies, should store these files in this folder. These files are deployed to the CDN upon `push` to `master` from any daily pull request. CDN resources can be referenced using `https://static.fast.design/assets/` matching the folder name in source code. For example, `https://static.fast.design/assets/favicon.ico`.

A CORS policy exists for allowing all production and staging sites for `*.*.fast.design` to accept requests for `.json` and `.js` files.  

### Building for Resiliency
https://docs.microsoft.com/en-us/azure/architecture/framework/resiliency/overview

### Naming Standards
Follow all naming standards from https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging with the one exception, suffix instead of prefix. For example, prefixing with `rg-` is the recommendation. However, FAST uses `-rg` as a suffix instead to allow for product / area groupings and sorting.  This works well considering that the Azure Portal already has a column for Resource Type.

* Use lower case letters
* Prefix with the product name, example: "fast"
* Append the Azure Service with the first letters of each service type, for example "as", would be used for App Service
* Append a random number from 1-9, example, fast-as-1, for services of the same type
* When services dictate, it's ok to deviate from this naming

## Log Analytics Reporting
To query Front Door metics and diagnostics on WAP run on Azure Log Analytics:

```bash
AzureDiagnostics
| where ResourceType == "FRONTDOORS" and Category == "FrontdoorWebApplicationFirewallLog"
| where action_s == "Block"
```

## Troubleshooting
### Status
Azure Status https://status.azure.com/en-us/status
