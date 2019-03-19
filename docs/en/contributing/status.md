---
id: status
title: Status
sidebar_label: Status
---

# Status

This page can be used to display the health of FAST-DNA systems.

* [Circle CI - Status](https://status.circleci.com/)
* [Code Climate - Status](https://status.codeclimate.com/)
* [Azure DevOps - Status](https://status.dev.azure.com/)

## Azure DevOps Pipeline

### Component Explorer

#### Builds (CI)

[![Build Status](https://dev.azure.com/edgewebui/FAST/_apis/build/status/Component%20Explorer%20-%20CI?branchName=master)](https://dev.azure.com/edgewebui/FAST/_build/latest?definitionId=65&branchName=master)

#### Deployments (CD)

| Staging | Production |
|--|--|
|[![Build status](https://vsrm.dev.azure.com/edgewebui/_apis/public/Release/badge/db5c5831-7b32-4ef1-9e7d-205361d49e08/2/2)](https://explore-stage.fastdna.net) |[![Build Status](https://vsrm.dev.azure.com/edgewebui/_apis/public/Release/badge/db5c5831-7b32-4ef1-9e7d-205361d49e08/2/3)](https://explore.fastdna.net) |
| https://explore-stage.fastdna.net | https://explore.fastdna.net | 
* Automatically released after commit to master | * Manually released after design approval
