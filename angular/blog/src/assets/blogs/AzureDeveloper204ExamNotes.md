# Azure Developer 204 Exam Notes

# Overview
These are Azure Developer 204 exam revision notes. All pictures are taken from https://docs.microsoft.com/en-us/azure. All content is based on these docs.

[Read on github for a better viewing experience.](https://github.com/bealesd/bealesd.github.io/blob/master/blogs/AzureDeveloper204ExamNotes.md)

# Azure services
 - SAAS- Data, config, software already there, 365, ymail, etc.
 - PAAS- Web apps, create application and data, choose runtime.
 - IAAS- choose servers, networking.

# App Service
 - PAAS
 - service for hosting we apps, 
 - serverless code, 
 - api features (cors),
 - app templates, 
 
## Tiers
 - Free
 - Basic
 - Shared: not avaliable on Linux
 - Standard
 - Premium
 - Explanation

## App Service Plan
 - Region (West US, East US, etc.)
 - Number of VM instances
 - Size of VM instances (Small, Medium, Large)
 - Pricing tier (Free, Shared, Basic, Standard, Premium, PremiumV2, Isolated, Consumption)
 - Shared (shared vm): free/shared,
 - Dedicated (dedicated vm): Basic/Standard/Premium/PremiumV2
 - Isolated (dedicated vn) 
 - Comsumption (function apps)
 - needed for App Service
 - billing over time
 - multiple apps in a plan

## Deployment Slots
 - Instance of application running
 - Have different versions of the software, choose config
 - Blue green pattern, divide traffic between slots
 - can have different deployment to slots.
 - can swap slots around, without user knowing

## Scaling
 - Scale out - instances of app to increase capacity (horizontal scaling) - free/shared can't scale out
 - Scale up - increase the tier (vertical scaling)
 - load balanced automatically
 
## Swapping
 - Apps can be swapped, if mutliple apps slots exist
 - These settings stay the same:
   - Publishing endpoints
   - Always on
   - Custom domain names
 - these are slot specific and are swappable:
   - Handler mappings
   - General settings, such as framework version, 32/64-bit, web sockets

## Deployment
 - git, devops
 
## Security
 - open auth based
 - inject claims into requerst header
 - log and trace auth events
 
 |Auth Provider       | Endpojnt    |
| :------------- | :----------: |
|  Azure Active Directory | /.auth/login/aad  |
| Microsoft Account   | /.auth/login/microsoftaccount |
|  Facebook | /.auth/login/facebook |
|  Google | /.auth/login/google |
|  Twitter | /.auth/login/twitter  |

## Hybrid Connections
 - access resources on other networks
 - Single url (tcp host) and port combination
 - no intrnet facing endpoint needed
 - no firewall openings needed
 
## Traffic manager
 - control how requests from web clients are distributed to apps in Azure App Service

| TM | DESC |
| :------------- | :----------: |
| Priority | use a primary app for all traffic, and provide backups in case the primary or the backup apps are unavailable. |
| Weighted | distribute traffic across a set of apps, either evenly or according to weights, which you define.|
| Performance | when you have apps in different geographic locations, use the “closest” app in terms of the lowest network latency. |
| Geographic | direct users to specific apps based on which geographic location their DNS query originates from. |

## App Settings
 - pass varaibles to your application as env varaibles
 - enable diagnostics logging
   - Application logging: save logs from app code to a blob or file system
 - Web server logging
   - Raw HTTP request data, saved in blob or file system
 - Detailed error logging
   - copy user htm errors, save to file system
 - Failed request tracing
   - Detailed tracing information on failed requests, save to file system

---

# Azure Functions
## Capability
 - run code based on http request
 - schedule code to run at predefined times
 - process
    - storage blob
    - queue storage messages
    - cosmos db docs
 - respond to event grid events, subscriptions and filters
 - respond to event hubs
 - respond to service bus queue
 - solution for running small peice of code
 - build open source webjob
 - support many languages; c#, java, php, py, js, ps, sh
 - stateless, idempotent
 - avoid long running function

## Compute
 - Both Consumption and Premium plans automatically add compute power when your code is running
 - Your app is scaled out when needed to handle load, and scaled down when code stops running.

## Storage
 - On any plan, a function app requires a general Azure Storage account,
 - storage can be Azure Blob, Queue, Files, and Table.
 
## Trigger, binding, direction
 - For triggers, the direction is always "in"
 - trigger to start function (a trigger is a binding)
 - many bindings
 - Input and output bindings use "in" and "out'
 - Some bindings support a special direction "inout".
 
 ## Azure Queue
  - Azure Queue storage trigger, it scales based on the queue length and the age of the oldest queue message.
 
|Property| Values/Types |Comments|
| :------------- | :----------: |:----------: |
|type|string|Binding type. For example, queueTrigger.|
|direction|'in', 'out'|Indicates whether the binding is for receiving data into the function or sending data from the function.|
|name|string|The name that is used for the bound data in the function. For C#, this is an argument name; for JavaScript, it's the key in a key/value list.|
 
## Durable Functions
### Overview
 - stateful functions
 - manage state, restarts, checkpoints
 - can do partial workflows, that resume later on
 - orchetrator functions
 
### Application Patterns
 - Function chaining
 - Fan-out/fan-in
 - Async HTTP APIs
 
 ---
 
 # Azure Blob storage
 ## Overview
  - highly scalable
  - rest base cloud store
  - block blobs: store text and binary data, up to about 4.7 TB. Block blobs are made up of blocks of data that can be managed individually.
    - sequential file I/O
  - append blobs: are made up of blocks like block blobs, but are optimized for append operation
  - page blobs: store random access files up to 8 TB in size
   - random write pattern data
  - Serving images or documents directly to a browser.
  - Streaming video and audio.
  - Storing files for distributed access
  - Lifecycle management: move to diffrent tiers based on age, rules.json

## Blobs
| Type | Description |
| --- | --- |
| Block  |  store text and binary data, up to about 4.7 TB |
| | Block blobs are made up of blocks of data that can be managed individually. |
| Append  | are made up of blocks like block blobs, but are optimized for append operations. |
| | Append blobs are ideal for scenarios such as logging data from virtual machines. |
| Page  | store random access files up to 8 TB in size. |
| | Page blobs store virtual hard drive (VHD) files and serve as disks for Azure virtual machines. |

## Storage durability options
 - LRS
   - three replicas, one region
   - write aknowledged when all replicas anre committed
 - ZRS
   - 3 replicas, 3 zones, one region
   - synchronous write to all 3 zones
 - GRS
   - 6 replicas, two regions (3 per region)
   - async copy of secondary
 - RA-GRS
   - GRS plus read access to secondary
   - separate secondary endpoint
 - GZRS
   - 6 replicas, 3+1 zones, two regions
   - syns wtiyes to 3 zones, async to secondary
 - RGZRS
 
 ## Tiers
   - Premium:
     - solid state
     - low latency
   - Hot: 
     - frequent access
     - cheap access cost
     - higher storage cost
   - Cool:
     - infrequent data access, large volume
     - more pricey access cost
     - lower storage cost
   - Archive:
     - rarely access  data access, once a month
 
 ## Encryption
  - By default, data written to azure storage is encrypted using Storage Service Encryption (SSE).
  - Microsoft managed keys
  - Customer mangaged keys
    - key vault
  - Role Access (Acess control)
    - Storage account level
    - Container level

## Access
 - sdk
 - rest

### Class Library .NET v11
| Class | Description |
| --- | --- |
| CloudStorageAccount | The CloudStorageAccount class represents your Azure storage account |
| | Use this class to authorize access to Blob storage using your account access keys |
| CloudBlobClient | The CloudBlobClient class provides a point of access to the Blob service in your code. |
| CloudBlobContainer | The CloudBlobContainer class represents a blob container in your code. |
| CloudBlockBlob | The CloudBlockBlob object represents a block blob in your code. |

---

# Cosmos

## Overview
 - No SQL db
 - document db
 - costs more than blobs
 - global replication
 - pay for each region
 - Unlimited elastic write and read scalability.
   - reads and writes served in less than 10 milliseconds at the 99th percentile
 - The cost of all database operations is normalized by Azure Cosmos DB and is expressed by Request Units (or RUs, for short).
 - Stored procedures, user-defined functions, triggers, etc., are stored at the container level.
 
 ## Consistency levels
 - Strongly: 
   - offers a linearizability.
   - Linearizability refers to serving requests concurrently.
   - the staleness window is equivalent to zero
   - the clients are guaranteed to read the latest committed value of the write operation.
 - Bounded staleness: 
   - The reads are guaranteed to honor the consistent-prefix guarantee.
   - The reads might lag behind writes
   - Cosmos DB guarantees that the clients always read the value of a previous write.
 - Session:
   - Within a single client session reads are guaranteed to honor the consistent-prefix
 - Consistent prefix:
   - Updates that are returned contain some prefix of all the updates, with no gaps. 
   - Consistent prefix consistency level guarantees that reads never see out-of-order writes.
 - Eventual:
   - There's no ordering guarantee for reads.
   - In the absence of any further writes, the replicas eventually converge.
 
## APIS
 - sql api: JS and JSON native API based on the Azure Cosmos DB database engine. Use SQL syntax.
 - casnadra: data store for apps written for Apache Cassandra
 - table api: kv db
 - gremlin api: store and operate with graph data on a fully managed db service designed for any scale
 - mongo db: auto index data without requiring you to deal with schema and index management.

## Partition kyes
 - you can form a partition key by concatenating multiple property values into a single artificial partitionKey property. 
 - these keys are referred to as synthetic keys.

---

# VMs

![IAAS](https://azurecomcdn.azureedge.net/cvt-fdde87d637c93aaa8d44f0dccd6bc94b93ea7d42a2bc4f5a987d991913ae6ad1/images/page/overview/what-is-paas/what-is-paas.png)

## Overview
 - control over the computing environment
 - part of IAAS
 
## Cost
 - Storage - storing data on virtual hd, independent of if VM is running
   - Standard or premium (ssd)
   - Unmanaged (mange throughput, manage vhds) or  managed disks
 - Compute - compute capactity
   - Pay as you go - for short term
   - Reserved instances- pre purchased
   
 ## Availability sets
 
 - logical grouping of VMs
 - allows Azure to understand how your application is built to provide for redundancy and availability
 - 2 VMs in an availability set is recommended for highly available app and 99.95% Azure SLA
 - set is free, pay for VMs in set
 - availability set is composed of 2 extra groupings that protect against hardware failures and allow updates to safely be applied - fault domains (FDs) and update domains (UDs)
 - Fault domains
   - underlying hardware that share a common power source and network switch, similar to a rack 
   - distributes your VMs across these fault domains
   - limits the impact of potential physical hardware failures, network outages, or power interruptions
 - Update domains
   - logical group of underlying hardware that can undergo maintenance or be rebooted at the same time
   - VMs are in an availability set. Azure auto distributes your VMs across these update domains.
 
 ## Azure Resource Manager 
 
 (![AZ RM Overview](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/media/overview/consistent-management-layer.png)
 
  - deployment and management service for Azure
  - create, update, and delete resources in your Azure subscription
  - a user sends a request from any of the Azure tools, APIs, SDKs, Resource Manager receives the request
  - authenticates and authorizes the request
  - Resource provider
   - service that supplies the resources you can deploy and manage through Resource Manager
  - ARM template deployment
   - deploy a template, Resource Manager converts the template into REST API operations
   - single or multi tiered templates can be used
   - conditional deployemnt, can use in json, check if resource already exists
 
  - Azure Resource Manager deployment modes
   - Complete:  rm deletes resources that exist in the resource group but aren't specified in the template.
   - Incremental: rm leaves unchanged resources that exist in the resource group but aren't specified in the template.
   
### Management Scope
 - Subscription
 - Management group
 - Resource group
 - resources

## Container
 - cheaper
 - no vm, for running software
 - startup time less than vm

### Docker
 - Docker is a containerization platform used to develop, ship, and run containers.
 - Docker client:
   - a cli named docker that uses the Docker REST API to send instructions to either a local or remote server
   - used to manage containers
 - Docker rmi: Removes the image from the registry, specify name or ID of the image to remove.

### Azure Container Registry overview
 - a managed, private Docker registry service based on the open-source Docker Registry 2.0
 - Pull images from an Azure container registry to various deployment targets

### Azure Container Instances overview
 - Useful for scenarios that can operate in isolated containers, including simple applications, task automation, and build jobs. Benefits:
   - Fast startup: Launch containers in seconds.
   - Per second billing: Incur costs only while the container is running.
   - Hypervisor-level security: Isolate your application as completely as it would be in a VM.
   - Custom sizes: Specify exact values for CPU cores and memory.
   - Persistent storage: Mount Azure Files shares directly to a container to retrieve and persist state.
   - Linux and Windows: Schedule both Windows and Linux containers using the same API.
 - top-level resource in Azure Container Instances is the container group
 - container group:  collection of containers that get scheduled on the same host machine
 - Multi-container groups currently support only Linux containers.
 - Windows containers, Azure Container Instances only supports deployment of a single instance.

---

# Authentication and authorisation

## Azure AD Application
 - refers to its registration and role in authentication/authorization at runtime.
 - it can run in the following contexts
   - client role
   - resource server role
 - registering an application in AAD creates:
   - application object
   - service principal object
   
## SAS (shared access signature)
 - a signed URI that points to >= 1 storage resource, includes a token that contains a special set of query parameters.
 - accessed via:
   - storage account key
   - a user delegation key

## Microsoft Authentication Library (MSAL)
 - public clients: 
   - run on devices or desktop computers or in a web browser
   - app does not keep application secrets,
   - it only accesses Web APIs on behalf of the user
   - It can't hold configuration-time secrets, so it doesn't have client secrets
 - confidential clients
   - run on servers
   - client ID is exposed through the web browser, secret is passed only in the back channel and never directly exposed.
 -  MSAL.NET 3.x
   - instantiate an application using instantiate an application
   - PublicClientApplicationBuilder and ConfidentialClientApplicationBuilder
   - Most .With modifiers can be used for both the Public and Confidential builders. Some are only for Confidential;
     - .WithCertificate()
     - .WithClientSecret()

## AD Authentication Library(ADAL)
 - streamline AAD from code
   - manage tokens
   - cache tokens
   - refrresh token automatically
   - async invocation
   
| Flow               | Description                                                                    |
|--------------------|--------------------------------------------------------------------------------|
| Authorization code | Native and web apps securely obtain tokens in the name of the user             |
| Client credentials | Service applications run without user interaction                              |
| On-behalf-of       | The application calls a service/web API, which in turns calls Microsoft Graph  |
| Implicit           | Used in browser-based applications                                             |
| Device code        | Enables sign-in to a device by using another device that has a browser         |
| Integrated Windows | Windows computers silently acquire an access token when they are domain joined |
| Interactive        | Mobile and desktops applications call Microsoft Graph in the name of a user    |
| Username/password  | The application signs in a user by using their username and password           |
 
---
 
 # KeyVault
  - Azure Key Vault provides:
    - Secrets Management
    - Key Management
    - Certificate Management
    - Store secrets backed by Hardware Security Module
  - Monitor access and use: log to azure monitor logs/eventhub stream/archive storage account
  - Securely store secrets and keys:
  - Azure AD: the Active Directory service for a tenant. Each directory has one or more domains. A directory can have many subscriptions associated with it, but only one tenant.
  - Azure tenant ID:  a unique way to identify an Azure AD instance within an Azure subscription.
  - Service principal: a security identity that user apps, services, and automation tools use to access specific resources.
  
 ## Auth for KeyVault
  - Managed identities for Azure resources: assign id to resource to get access to kv
  - Service principal and certificate: not recommended
  - Service principal and secret: not recommended
  
## Accessing for KeyVault
 - api_version is always required 
  
 ## Managed identities
 - code has to authenticate to Key Vault to retrieve keys
 - managed ids solves this problem, and live in AAD.
 - can use identities to authenticate any service supporting AAD.
 
  ## Terminology
 - Client ID: a unique identifier generated by Azure AD that is tied to an application and service principal during its initial provisioning.
 - Principal ID: the object ID of the service principal object for your managed identity that is used to grant role-based access to an Azure resource.
 - Azure Instance Metadata Service (IMDS): a REST endpoint accessible to all IaaS VMs created via the Azure Resource Manager. The endpoint is available at a well-known non-routable IP address (169.254.169.254) that can be accessed only from within the VM.
 
 ## Types
  - A system-assigned managed identity is enabled directly on an Azure service instance.
  - A user-assigned managed identity is created as a standalone Azure resource

| | System-assigned managed identity  | User-assigned managed identity  |
|---------|---------|-------|
| Creation | • Created as part of an Azure resource (for example, an Azure virtual machine or Azure App Service) | • Created as a stand-alone Azure resource |
| Lifecycle  | • Shared lifecycle with the Azure resource that the managed identity is created with. • When the parent resource is deleted, the managed identity is deleted as well. | • Independent life-cycle. Must be explicitly deleted. |
| Sharing across Azure resources | • Cannot be shared. • It can only be associated with a single Azure resource.  | • Can be shared. • The same user-assigned managed identity can be associated with more than one Azure resource.|
| Common use cases  | • Workloads that are contained within a single Azure resource. • Workloads for which you need independent identities.  | • Workloads that run on multiple resources and which can share a single identity. • Workloads that need pre-authorization to a secure resource as part of a provisioning flow. • Workloads where resources are recycled frequently, but permissions should stay consistent. |

## Azure App Configuration
 - Do not store application secrets in App Configuration.
 - provides a service to centrally manage application settings
 - complements Azure Key Vault
 - centralize management and distribution of hierarchical configuration data for different environments
 - dynamically change application settings without the need to redeploy or restart an application
 - stores configuration data as key-value pairs
 - labels:
  - allow muliple versions of key value
  - multiple environments for the same key

---

# APIM
## API gateway
 - Accepts API calls and routes them to your backends.
 - Verifies API keys, JWT tokens, certificates, and other credentials.
 - Enforces usage quotas and rate limits.
 - Transforms your API on the fly without code modifications.
 - Caches backend responses where set up.
 - Logs call metadata for analytics purposes.
 
## Azure portal 
 - set up your API program
 - Define or import API schema.
 - Package APIs into products.
 - set up policies like quotas or transformations on the APIs.
 - Get insights from analytics.
 - Manage users.
 
## Developer portal
 - Read API documentation.
 - Try out an API via the interactive console.
 - Create an account and subscribe to get API keys.
 - Access analytics on their own usage.
 
 ## Products
  - how APIs are accessed by developers
  - Products in API Management have one or more APIs
  - Products can be Open or Protected
  - Protected products must be subscribed to
  - open dont require a subscription 

## Groups
 - manage the visibility of products to developers
 - administrators
   - Azure subscription administrators are members of this group. 
   - manage API Management service instances
   - creating the APIs, operations, and products that are used by developers.
 - Developers 
   - Authenticated developer portal users fall into this group. 
   - build applications using your APIs.
   - granted access to developer portal
   - build applications that call the operations of an API.
 - Guests
   - Unauthenticated developer portal users
   - can be granted read-only access, such as the ability to view APIs but not call them.

## Developers
 - represent the user accounts in an API Management service instance.
 - can be created or invited to join by administrators
 - can sign up from the Developer portal.
 - Each developer is a member of one or more groups, and can subscribe to the products that grant visibility to those groups.

## Policies
 - sits between the API consumer and the managed API
 - allow the Azure portal to change the behavior of the API through configuration.
 - Policies are a collection of statements that are executed sequentially on the request or response of an API.
 - i.e. conversion from XML to JSON, call rate limiting to restrict the number of incoming calls from a developer
 
| policies |                                                                 |
|----------|-----------------------------------------------------------------|
| inbound  | statements to be applied to the request go here                 |
| backend  | statements to be applied before the request is forwarded to     |
| outbound | the backend service go here                                     |
| on-error | statements to be applied if there is an error condition go here |
 
 
| Advanced Policies |                  |
|-------------------|------------------|
| Control flow      | Conditionally applies policy statements based on the results of the evaluation of Boolean expressions. Control flow policy must contain at least one "when" element|
| Forward request   | Forwards the request to the backend service. |
| Limit concurrency | Prevents enclosed policies from executing by more than the specified number of requests at a time. |
| Log to Event Hub  | Sends messages in the specified format to an Event Hub defined by a Logger entity.  |
| Mock response     | Aborts pipeline execution and returns a mocked response directly to the caller.  |
| Retry             | Retries execution of the enclosed policy statements, if and until the condition is met. Execution will repeat at the specified time intervals and up to the specified retry count. |

## Subscriptions 
 - secure APIs by using subscription keys
 - to get a subscription key for accessing APIs, a subscription is required
 - API publishers can create subscriptions directly for API consumers.
 - subscription is essentially a named container for a pair of subscription keys
 - don't need approval from API publishers
 - Note: API Management supports other mechanisms for securing access to APIs, including: OAuth2.0, Client certificates, and IP whitelisting.
 
| Subscription Scope | Details     |
|--------------------|-------------|
| All APIs           | Applies to every API accessible from the gateway  |
| Single API         | This scope applies to a single imported API and all of its endpoints  |
| Product            | A product is a collection of one or more APIs that you configure in API Management. You can assign APIs to more than one product. Products can have different access rules, usage quotas, and terms of use. |

## client certificates to secure access to an API
 - Certificates can be used to provide TLS mutual authentication between the client and the API gateway.
 - can configure the APIM gateway to allow only requests with certificates containing a specific thumbprint.
 - tls can check certificates for:
 
| Property                   | Reason                                               |
|----------------------------|------------------------------------------------------|
| Certificate Authority (CA) | Only allow certificates signed by a particular CA    |
| Thumbprint                 | Allow certificates containing a specified thumbprint |
| Subject                    | Only allow certificates with a specified subject     |
| Expiration Date            | Only allow certificates that have not expired        |
 
 ## Consumption tier
  - works well for apim with azure functions
  - explicitly enable the use of client certificates
  - this step is not necessary in other tiers.

---

# Azure Logic Apps
 - schedule, automate, and orchestrate tasks, business processes, and workflows
 - integrate apps, data, systems, and services across enterprises or organizations
 - i.e
   - Send email notifications with Office 365 when events happen in various systems, apps, and services.
   - Move uploaded files from an SFTP or FTP server to Azure Storage.
 - choose from a growing gallery with hundreds of ready-to-use connectors
 - connectors provide triggers, actions, or both for creating logic apps that securely access and process data in real time.
 
## Connectors
 - access from Azure Logic Apps to events, data, and actions across other apps, services, systems, protocols, and platforms
 - Built-ins:
   - triggers and actions are “native” to Azure Logic Apps 
   - custom schedules, communicate with other endpoints, receive and respond to requests, call Azure functions, Azure API Apps, APIs in APIM,  nested logic apps
 - Managed connectors
   - Deployed and managed by Microsoft
   - provide triggers and actions
   
| Category  | Description |
|-----------|-------------|
| Managed API connectors  Create logic apps that use services such as Azure Blob Storage, Office 365, Dynamics, Power BI, OneDrive, Salesforce, SharePoint Online, and many more. |
| On-premises connectors | After you install and set up the on-premises data gateway, these connectors help your logic apps access on-premises systems such as SQL Server, SharePoint Server, Oracle DB, file shares, and others.|
| Integration account connectors | Available when you create and pay for an integration account, these connectors transform and validate XML, encode and decode flat files, and process business-to-business (B2B) messages with AS2, EDIFACT, and X12 protocols. |

## Triggers and actions
 - Connectors can provide triggers, actions, or both.
 - Every logic app workflow starts with a trigger, which fires when a specific event happens, or when new available data meets specific criteria.
 - Many triggers provided by the connectors include basic scheduling capabilities for regular workload runs
 - When trigger fires, the Logic Apps engine creates a logic app instance that runs the actions in the workflow.
 - Recurrence trigger: This trigger runs on a specified schedule and isn't tightly associated with a particular service or system.
 - Polling trigger: This trigger regularly polls a specific service or system based on the specified schedule, checking for new data or whether a specific event happened. If new data is available or the specific event happened, the trigger creates and runs a new instance of your logic app, which can now use the data that's passed as input.
 - Push trigger: This trigger waits and listens for new data or for an event to happen. When new data is available or when the event happens, the trigger creates and runs new instance of your logic app, which can now use the data that's passed as input.

## Scheduling Azure Logic Apps

### Schedule triggers
 -  built-in Recurrence trigger or Sliding Window trigger, are Schedule-type triggers
 -  you can run tasks immediately, at a later time, or on a recurring interval.
 - Recurrence
   - Runs your workflow at regular time intervals based on your specified schedule. 
   - If recurrences are missed, the Recurrence trigger doesn't process the missed recurrences but restarts recurrences with the next scheduled interval.
 - Sliding Window
   - Runs your workflow at regular time intervals that handle data in continuous chunks.
   - If recurrences are missed, the Sliding Window trigger goes back and processes the missed recurrences.
   
### Schedule actions
 - Delay: Wait to run the next action for the specified number of time units, such as seconds, minutes, hours, days, weeks, or months.
 - Delay until: Wait to run the next action until the specified date and time.
 
## Azure Logic Apps and Enterprise Integration Pack
 - Enterprise Integration Pack (EIP) with Azure Logic Apps
 - EIP transforms different formats into a format that your organizations' systems can process
 - The EIP supports these enterprise integration connectors and these industry standards:
   - Electronic Data Interchange (EDI)
   - Enterprise Application Integration (EAI)
   
## Creating custom connectors

![lifecycle](https://docs.microsoft.com/en-us/connectors/custom-connectors/media/index/authoring-steps.png)

 - Build your API
   - A custom connector is a wrapper around a REST API
   - can be public or private APIs
 - Secure your API
   - AAD recommended
   - OAuth 2.0
   - Basic authentication
   - API Key
 - Describe the API and define the custom connector:
   - OpenAPI definition or
   - Postman collection
 - Use your connector in a Logic App, Flow, or PowerApps app
 - share your connector (optional)
 - certify your connector (optional)

---

# Azure Event Grid 
 - allows you to easily build applications with event-based architectures
 
 ![event grid](https://docs.microsoft.com/en-us/azure/event-grid/media/overview/functional-model.png)
 
## Events
 - An event is the smallest amount of information that fully describes something that happened in the system.
 - event is: source of the event, time the event took place, and unique identifier.
 - every event also has specific information that is only relevant to the specific type of event
 - An event of size up to 64 KB is covered by General Availability (GA) Service Level Agreement (SLA)
 - 1 MB is currently in preview
 
## Event sources
 - where the event happens
 - Each event source is related to one or more event types
 - i.e. Azure Storage is the event source for blob created events
 - your application is the event source for custom events that you define
 - event sources are responsible for sending events to Event Grid.
 
## Topics
 - provides an endpoint where the event source sends events.
 - publisher creates the event grid topic, decides if an event source needs >= 1 topic
 - topic is used for a collection of related events
 - to respond to certain types of events, subscribers decide which topics to subscribe to.
 - System topics:
   - built-in topics provided by Azure services
   - to subscribe, you provide information about the resource you want to receive events from.
   - as long as you have access to the resource, you can subscribe to its events.
   - not seen in subscription
 - Custom topics
   - are application and third-party topics
   - when you create or are assigned access to a custom topic, you see that custom topic in your subscription.

## Event subscriptions
 - A subscription tells Event Grid which events on a topic you're interested in receiving
 - when creating the subscription, you provide an endpoint for handling the event
 - can filter the events that are sent to the endpoint
 
## Event handlers
 - an event handler is the place where the event is sent.
 - takes some further action to process the event
 - support Azure service or your own webhook as the handler.
 - For HTTP webhook event handlers, the event is retried until the handler returns a status code of 200 – OK
 - For Azure Storage Queue, the events are retried until the Queue service successfully processes the message push into the queue.

## Event schema
 
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| topic     | string | No, but if included, must match the Event Grid topic Azure Resource Manager ID exactly. If not included, Event Grid will stamp onto the event. | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| subject   | string | Yes | Publisher-defined path to the event subject. |
| eventType | string | Yes | One of the registered event types for this event source. |
| eventTime | string | Yes  | The time the event is generated based on the provider's UTC time.  |
| id        | string | Yes  | Unique identifier for the event.   |

## Event Grid security and authentication

### WebHook event delivery
 - When a new event is ready, Event Grid service POSTs an HTTP request to the configured endpoint with the event in the request body.
 - Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint.
 - validation is auto handles if:
   - Azure Logic Apps with Event Grid Connector
   - Azure Automation via webhook
   - Azure Functions with Event Grid Trigger
 - for other endpoint types, such as an HTTP trigger based Azure function, your endpoint code needs to participate in a validation handshake with Event Grid
   - ValidationCode handshake (programmatic)
   - ValidationURL handshake (manual)

### Event subscriptions
 - To subscribe to an event, you must prove that you have access to the event source and handler.
 - You must have the Microsoft.EventGrid/EventSubscriptions/Write permission on the resource that is the event source
 - System topic:
   - Need permission to write a new event subscription at the scope of the resource publishing the event.
 - Custom topic:
   - Need permission to write a new event subscription at the scope of the event grid topic.

### Custom topic publishing
 - use either Shared Access Signature (SAS) or key authentication
 - include the authentication value in the HTTP header

## Event filtering for Event Grid subscriptions
 - When creating an event subscription, you have three options for filtering:
   - Event types
   - Subject begins with or ends with
   - Advanced fields and operators
   
---

# Event Hubs
 - big data streaming platform and event ingestion service
 - It can receive and process millions of events per second
 - “front door” for an event pipeline, often called an event ingestor
 - Platform-as-a-Service
 - partitioned consumer model, enabling multiple apps to process the stream concurrently and letting you control the speed of processing.
 - Scaling options, like Auto-inflate, scale the number of throughput units to meet your usage needs.

## Concepts
 - Event producers or publisher: Any entity that sends data to an event hub. Event publishers can publish events using HTTPS to an event hub
 - Partitions: Each consumer only reads a specific subset, or partition, of the message stream.
 - Consumer groups: A view (state, position, or offset) of an entire event hub. Consumer groups enable consuming applications to each have a separate view of the event stream. They read the stream independently at their own pace and with their own offsets.
 - Throughput units: Pre-purchased units of capacity that control the throughput capacity of Event Hubs.
 - Event receivers: Any entity that reads event data from an event hub. The Event Hubs service delivers events through a session as they become available.

## Capture events through Azure Event Hubs
 - hubs enables you to auto capture the streaming data in Event Hubs in an Azure Blob storage or Azure Data Lake Storage account
 - you can specify a time or size interval.
 - Capture windowing:
   -  window to control capturing
   - this window is a minimum size and time configuration with a “first wins policy,” meaning that the first trigger encountered causes a capture operation.
 - Scaling to throughput units:
   - Event Hubs traffic is controlled by throughput units
   - A single throughput unit allows 1 MB per second or 1000 events per second of ingress and twice that amount of egress.
   - Usage beyond your purchased throughput units is throttled

## Event Hubs Dedicated 
 - Single-tenancy: A Dedicated cluster guarantees capacity at full scale, and can ingress up to gigabytes of streaming data with fully durable storage and sub-second latency to accommodate any burst in traffic.
 - Access to features: The Dedicated offering includes features like Capture at no additional cost, as well as exclusive access to upcoming features like Bring Your Own Key (BYOK). The service also manages load balancing, OS updates, security patches and partitioning for the customer, so that you can spend less time on infrastructure maintenance and more time on building client-side features.
 - Cost Savings: At high ingress volumes (>100 TUs), a cluster costs significantly less per hour than purchasing a comparable quantity of throughput units in the Standard offering.
 
 ## Azure Event Hubs authentication and security model
 - The Azure Event Hubs security model meets the following requirements:
   - Only clients that present valid credentials can send data to an event hub.
   - A client cannot impersonate another client.
   - A rogue client can be blocked from sending data to an event hub.
   
### Client authentication
 - security model based on a combination of Shared Access Signature (SAS) tokens and event publishers
 - Generate tokens using a SAS key, one token per client, for an eventHub
 - Sending data: when a client sends data to an event hub, it also sends token.
 - Blacklisting clients: renders that client unusable until it receives a new token that uses a different publisher.
 - Event Hubs consumer group for consuming data generate by event hubs clients

## SDK
 - Microsoft.Azure.EventHubs.EventHubClient: for publishing data to Event Hub
 
 # Azure Notification Hubs
  -  easy-to-use and scaled-out push engine that enables you to send notifications to any platform (iOS, Android, Windows, etc.) from any back-end (cloud or on-premises)
  - Send breaking news notifications to millions with low latency.
  - Send location-based coupons to interested user segments.
  - Send codes for multi-factor authentication.
 
 ## what
  - app-to-user communication (mobile)
  - energy-efficient for mobile devices
  - available when corresponding applications are not active.

## how push notification work
 - delivered through platform-specific infrastructures called Platform Notification Systems (PNSes)
 - no common interface
 - deliver a message to a device with a provided handle
 - An app wants to receive a notification, it contacts the PNS and requests a unique and temporary push handle
 - The client app stores this handle in the app backend or provider.
 - To send a push notification, the app backend contacts the PNS using the handle to target a specific client app.
 - The PNS forwards the notification to the device specified by the handle.

## Why use Azure Notification Hubs
 - Cross platforms: Support for all major push platforms. Device handle management in one place.
 - Cross backends: .NET, Node.js, Java, Python, etc. Cloud or on-premises.
 - Security: SAS
 - Scalability: no re-architecting or sharding
 - telemetry: Per-message telemetry tracks each push, error, device info.
 - delivery patterns:
   - Broadcast to one or more platforms
   - Push to device: You can target notifications to individual devices.
   - Push to user
   - Localized push
   - scheduled push
   - push to segment with dynamic tags (active AND lives in Seattle NOT new user)
   - Silent push - triggering them to complete certain pulls or actions.
   - Direct push
   - Personalized push

## Security claims
 - Listen: Create/Update, Read, and Delete single registrations
 - Send: Send messages to the Notification Hub
 - Manage: CRUDs on Notification Hubs, and read registrations based on tags

## Device registration
 - Device registration with a Notification Hub is accomplished using a Registration or Installation.
 - Registration:
   - associates the Platform Notification Service (PNS) handle for a device with tags and possibly a template
   - Azure Notification Hubs supports a maximum of 60 tags per registration.
 - Installations:
   - enhanced registration that includes a bag of push related properties
   - It is the latest and best approach to registering your devices
   - not supported by client-side .NET SDK
   - Notification Hubs REST API approach to support installations
   - Creating or updating an installation is fully idempotent
   - also enables you to do partial registration updates
 - Templates: the device installation also holds all templates associated with that device in a JSON format.

---

# Azure Service Bus overview
 - fully managed enterprise integration message broker
 - decouple applications and services
 - reliable and secure platform for asynchronous transfer of data and state.
 - Data is transferred between different apps and services using messages
 - A message is in binary format and can contain JSON, XML, or just text.
 
## Namespaces
 - A namespace is a container for all messaging components.
  - Multiple queues and topics can be in a single namespace, and namespaces often serve as application containers.

## Queues
 - FIFO
 - Messages are sent to and received from queues. 
 - Queues store messages until the receiving application is available to receive and process them.

## Topic
 - You can also use topics to send and receive messages
 - a queue is often used for point-to-point communication, topics are useful in publish/subscribe scenarios.
 - Topics can have multiple, independent subscriptions
 - A subscriber to a topic can receive a copy of each message sent to that topic.
 - Subscriptions are named entities. Subscriptions persist, but can expire or autodelete.
 - You may not want individual subscriptions to receive all messages sent to a topic. Use filters and rules to define conditions that trigger optional actions. You can filter specified messages and set or modify message properties.
 
## Advanced features
 - Dead-letter queue - holds messages that can't be delivered to any receiver.
 - Message sessions - allow FIFO
 - Autoforwarding - chains a queue or subscription to another queue or topic that is in the same namespace.
 - Batching - delay sending a message for a certain period of time
 - Scheduled delivery - delayed processing
 - Message deferral - can defer retrieval of a message until a later time.
 - Transactions - groups two or more operations together into an execution scope.
 - Filtering and actions - Subscribers can define which messages they want to receive from a topic
 - Duplicate detection - nables the sender to resend the same message, or discard any duplicate copies
 - Autodelete on idle - idle interval after which a queue is automatically deleted.
 - Security protocols: SAS, RBAC, Managed identities for azure resources
 - Security: HTTP/REST protocols.
 - Geo-disaster recovery: enables data processing to continue operating in a different region or datacenter.

## Settling receive operations
 - ReceiveAndDelete
   - tells the broker to consider all messages it sends to the receiving client as settled when sent
   - That means that the message is considered consumed as soon as the broker has put it onto the wire
   - If the message transfer fails, the message is lost.
 - PeekLock
   - tells the broker that the receiving client wants to settle received messages explicitly
   - message is made available for the receiver to process, while held under an exclusive lock in the service so that other, competing receivers cannot see it

# Azure Queue storage overview
 - storing large numbers of messages that can be accessed from anywhere via authenticated calls using HTTP or HTTPS
 - Creating a backlog of work to process asynchronously
 - Passing messages from an Azure web role to an Azure worker role
 - max time for message in queue: 

## Queue service components
![Queue service components](https://docs.microsoft.com/en-us/azure/storage/queues/media/storage-queues-introduction/queue1.png)

 - URL format: Queues are addressable using the following URL format:
https://<storage account>.queue.core.windows.net/<queue>
 - Storage account: All access to Azure Storage is done through a storage account.
 - Queue: A queue contains a set of messages. All messages must be in a queue. Note that the queue name must be all lowercase.
 - Message: A message, in any format, of up to 64 KB. The maximum time that a message can remain in the queue is seven days.
 
## sdk
 - dequeue methods:
  - DeleteMessage and GetMessage
- GetMessage: message returned from GetMessage becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. 

---

# Azure Monitor overview
 - maximizes the availability and performance of your applications and services
 - delivering a comprehensive solution for collecting, analyzing, and acting on telemetry
 - helps you understand how your apps are performing and identifies issues affecting them and thier resources

![azure monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/media/overview/overview.png)

## Alerts
 - Target Resource:
   - Defines the scope and signals available for alerting.
   - A target can be any Azure resource. 
   - Example targets: a virtual machine, a storage account, a virtual machine scale set, a Log Analytics workspace, or an Application Insights resource. 
   - For certain resources (like virtual machines), you can specify multiple resources as the target of the alert rule.
 - Signal: Emitted by the target resource. Signals can be of the following types: metric, activity log, Application Insights, and log.
 - Criteria: A combination of signal and logic applied on a target resource.
 - Alert Name: A specific name for the alert rule configured by the user.
 - Alert Description: A description for the alert rule configured by the user.
 - Severity: The severity of the alert after the criteria specified in the alert rule is met. Severity can range from 0 to 4.
 - Action: A specific action taken when the alert is fired.

### Severity
 - Sev 0 = Critical
 - Sev 1 = Error
 - Sev 2 = Warning
 - Sev 3 = Informational
 - Sev 4 = Verbose

### State
 - New:	The issue has just been detected and hasn't yet been reviewed.
 - Acknowledged:	An administrator has reviewed the alert and started working on it.
 - Closed:	The issue has been resolved. After an alert has been closed, you can reopen it by changing it to another state.

### What you can alert on
 - Metric values
 - Log search queries
 - Activity log events
 - Health of the underlying Azure platform
 - Tests for website availability

## Application Insights
 - is an extensible Application Performance Management (APM) service for web developers on multiple platforms
 - Use it to monitor your live web application
 - It will automatically detect performance anomalies
 - powerful analytics tools to help you diagnose issues and to understand what users actually do with your app.
 
### How
 - You install a small instrumentation package in your application
 - and set up an Application Insights resource in the Microsoft Azure portal. 
 - The instrumentation monitors your app and sends telemetry data to Azure Monitor.
 
 |Monitor|Description|
 |-------|-----------|
 |Request rates, response times, and failure rates|Find out which pages are most popular, at what times of day, and where your users are. See which pages perform best. If your response times and failure rates go high when there are more requests, then perhaps you have a resourcing problem.|
 |Dependency rates, response times, and failure rates |Find out whether external services are slowing you down.|
 |Exceptions | Analyze the aggregated statistics, or pick specific instances and drill into the stack trace and related requests. Both server and browser exceptions are reported.|
 |Page views and load performance |reported by your users' browsers.|
 |AJAX calls|from web pages - rates, response times, and failure rates.|
 |User and session counts.||
 |Performance counters||
 |Host diagnostics|from Docker or Azure.|
 |Diagnostic trace logs|from your app - so that you can correlate trace events with requests.|
 |Custom events and metrics| that you write yourself in the client or server code, to track business events such as items sold or games won.|
 
 ## Monitor the availability of any website
 ### URL ping test
  - uses more advanced HTTP request functionality to validate whether an endpoint is responding
  - measures the performance associated with that response
  - adds the ability to set custom success criteria coupled with more advanced features like parsing dependent requests, and allowing for retries.
 
 ### Telemetry channels in Application Insights
 - Telemetry channels are an integral part of the Azure Application Insights SDKs
 - Telemetry channels are responsible for buffering telemetry items and sending them to the Application Insights service
 - The .NET and .NET Core versions of the SDKs have two built-in telemetry channels: InMemoryChannel and ServerTelemetryChannel.
 - A telemetry channel is any class that implements the Microsoft.ApplicationInsights.ITelemetryChannel interface.
 - InMemoryChannel: A lightweight channel that buffers items in memory until they're sent. Items are buffered in memory and flushed once every 30 seconds, or whenever 500 items are buffered.
 - ServerTelemetryChannel: A more advanced channel that has retry policies and the capability to store data on a local disk. This channel retries sending telemetry if transient errors occur.

## Distributed tracing
 - Distributed tracing is the equivalent of call stacks for modern cloud and microservices architectures
 - simplistic performance profiler thrown in
 - 2 experiences for consuming distributed trace data:
   - transaction diagnostics: 1 single transaction/request, and is helpful for finding the root cause of reliability issues and performance bottlenecks on a per request basis.
   - application map view: aggregates many transactions to show a topological view of how the systems interact, and what the average performance and error rates are.

## Azure Activity Log
 - insight into subscription-level events that have occurred in Azure
 - determine the what, who, and when for any write operations (PUT, POST, DELETE) taken on the resources in your subscription

## Application Map
 - helps you spot performance bottlenecks or failure hotspots across all components of your distributed application
 - Each node on the map represents an application component or its dependencies; and has health KPI and alerts status

### What is a Component?
 - independently deployable parts of your distributed/microservices application
 - code-level visibility or access to telemetry generated by these application components.
 
### Composite Application Map
 - You can see the full application topology across multiple levels of related application components 
 - Components could be different Application Insights resources, or different roles in a single resource.
 - The app map finds components by following HTTP dependency calls made between servers with the Application Insights SDK installed.
 - starts with progressive discovery of the components. When you first load the application map, a set of queries is triggered to discover the components related to this component
 
![composite app map](https://docs.microsoft.com/en-us/azure/azure-monitor/app/media/app-map/app-map-001.png)
 
 - Application Map uses the cloud role name property to identify the components on the map
 
 ## Transient errors
  - An app that communicates with elements running in the cloud has to be sensitive to the transient faults that can occur in this environment. 
  - Faults include the loss of network connectivity to components and services, temporary unavailability of a service, or timeouts that occur when a service is busy.

### Handling transient errors
 - Cancel: 
   - If the fault indicates that the failure isn't transient or is unlikely to be successful if repeated, the application should cancel the operation and report an exception.
   - For example, an authentication failure caused by providing invalid credentials is not likely to succeed no matter how many times it's attempted.
 - Retry:
   - If the specific fault reported is unusual or rare, it might have been caused by unusual circumstances, such as a network packet becoming corrupted while it was being transmitted. 
   - In this case, the application could retry the failing request again immediately, because the same failure is unlikely to be repeated, and the request will probably be successful.
 - Retry after a delay:
   - If the fault is caused by one of the more commonplace connectivity or busy failures, the network or service might need a short period of time while the connectivity issues are corrected or the backlog of work is cleared.
   - The application should wait for a suitable amount of time before retrying the request.
   
---

# Azure Cache for Redis
 - Caching is the act of storing frequently accessed data in memory that is very close to the application that consumes the data
 - increase performance and reduce the load on your servers
 - create an in-memory cache that can provide excellent latency and potentially improve performance
 - accessible from any application within Azure
 - typically used to improve the performance of systems that rely heavily on back-end data store
 - cached data is located in-memory on an Azure server running the Redis cache
 
## What type of data can be stored in the cache
 - Binary-safe strings (most common)
 - Lists of strings
 - Unordered sets of strings
 - Hashes
 - Sorted sets of strings
 - Maps of strings
 - Each data value is associated to a key for value lookup in cache
 - Redis works best with smaller values (100k or less),
 - Storing larger values is possible (up to 500 MB), but increases network latency and can cause caching and out-of-memory issues if the cache isn't configured to expire old values.
 
## What is a Redis key?
 - keys are also binary safe strings
 - Avoid long keys.
 - They take up more memory and require longer lookup times because they have to be compared byte-by-byte.
 - You can use binary blob as the key, generate a unique hash and use that as the key instead. The maximum size of a key is 512 MB
 - Use keys which can identify the data. For example, “sport:football;date:2008-02-02” would be a better key than "fb:8-2-2".
 - Use a convention. A good one is “object:id”, as in "sport:football".
 - Redis cache will need a globally unique name. 
 - The name has to be unique within Azure because it is used to generate a public-facing URL to connect and communicate with the service
 
## How is data stored in a Redis cache?
 - Data in Redis is stored in nodes and clusters.
 - Nodes are a space in Redis where your data is stored.
 - Clusters are sets of three or more nodes your dataset is split across. Clusters are useful because your operations will continue if a node fails or is unable to communicate to the rest of the cluster.

## Redis caching architectures
 - how we distribute our data in the cache
 - redis distributes data in three major ways:
   1. Single node
   2. Multiple node
   3. Clustered
 - caching architectures are split across Azure by tiers:
   - Basic cache: 
     - A basic cache provides you with a single node Redis cache. 
     - The complete dataset will be stored in a single node. 
     - This tier is ideal for development, testing, and non-critical workloads.
   - Standard cache: 
     - The standard cache creates multiple node architectures. 
     - Redis replicates a cache in a two-node primary/secondary configuration. 
     - Azure manages the replication between the two nodes.
     - This is a production-ready cache with master/slave replication.
   - Premium tier
     - The premium tier includes the features of the standard tier but adds the ability to persist data, take snapshots, and back up data. 
     - You can create a Redis cluster that shards data across multiple Redis nodes to increase available memory.
     - Supports an Azure Virtual Network to give you complete control over your connections, subnets, IP addressing, and network isolation. 
     - Includes geo-replication, so you can ensure your data is close to the app that's consuming it.

## SDK
 - Redis client for the .NET language is StackExchange.Redis
 - connection string: [cache-name].redis.cache.windows.net:6380,password=[password-here],ssl=True,abortConnect=False
 - connection: ConnectionMultiplexer.Connect(connectionString)
 - Redis database is represented by the IDatabase type
 -  CreateTransaction method creates a group of operations that will be sent to the server as a single unit and processed on the server as a single unit.
 
 ---
 
# Azure CDN
 - global CDN solution for delivering high-bandwidth content that is hosted in Azure or in any other location
 - cache publicly available objects loaded from Azure Blob storage, a web application, a virtual machine, or any publicly accessible web server
 - accelerate dynamic content, which cannot be cached, by taking advantage of various network optimizations by using CDN POPs

![cdn](https://docs.microsoft.com/en-us/azure/cdn/media/cdn-overview/cdn-overview.png)

## Azure CDN key features
 - Dynamic site acceleration
 - CDN caching rules
 - HTTPS custom domain support
 - Azure diagnostics logs
 - File compression
 - Geo-filtering

## Cache expiration in Azure CDN
 - A cached resource is considered to be fresh when its age is less than the age or period defined by a cache setting.
 - Global caching rules:
   - You can set one global caching rule for each endpoint in your profile that affects all requests to the endpoint.
   - The global caching rule overrides any HTTP cache-directive headers, if set.
 - Custom caching rules:
   - You can set one or more custom caching rules for each endpoint in your profile. 
   - Custom caching rules match specific paths and file extensions; are processed in order; and override the global caching rule, if set.
   
## Limitations
 - Each Azure subscription has default limits for the following resources:
   1. The number of CDN profiles that can be created.
   2. The number of endpoints that can be created in a CDN profile.
   3. The number of custom domains that can be mapped to an endpoint.

---

# Azure Overiew

## Azure Resource Manger
 - Azure Resource Manager is the deployment and management service for Azure. 
   - It provides a management layer that enables you to create, update, and delete resources in your Azure account.
   - You use management features, like access control, locks, and tags, to secure and organize your resources after deployment.
   
![azure rm](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/media/overview/consistent-management-layer.png)

## Service Principal
 - Is an identity created to access Azure resources
 - Access is restricted by the roles assigned to the service principal
 - A service principal must be created in each tenant where the application is used
 - It can establish an identity for sign-in and/or access to resources being secured by the tenant
 - A single-tenant application has only one service principal (in its home tenant), created and consented for use during application registration. 
 - A multi-tenant Web application/API has a service principal created in each tenant where a user from that tenant has consented to its use.
 
## Azure AD application
 - When you register an AAD application it creates:
   - Application object: 1 app object defined in the AAD tenant where it was created
   - Service principal object: access policy and permissions for the user/application in AAD tenant
 - NB. an entity that requires access must be represented by a security principal. This is true for both users (user principal) and applications (service principal).
 
## Tenent
 - sits inside a domain
 - a domain can have multiple tenants
 - users have to be addde to a domain


