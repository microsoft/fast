# Local testing of GitHub Actions
Leverage the knowledge from https://github.com/nektos/act for detailed instructions.

## Install
### 1. Install Docker
Required to run GitHub Actions on VMs. Choose your preferred Docker setup https://docs.docker.com/get-docker/.

### 2. Install Nektos
Required to run GitHub Actions locally. 

```bash
$ brew install nektos/tap/act
```

### 3. Install Azure CLI
Required to integrate GitHub Actions and Azure.

```bash
$ azure login
```

## Configure
The `.actrc` file contains the default configuration and run methods. The `./.github/workflows/testing/push.json` file contains the default GitHub events to run.

The `./.github/workflows/ci-daily-local.yml` file must reside in `./.github/workflows/` in order to run `act`.

Update the "ref" values in `./.github/workflows/testing/push.json` to point to the local git branch to test.  Then perform the following to execute against that branch when running `act`.

```bash
$ act -e `./.github/workflows/testing/push.json`
```

## Test
`./.github/workflows/ci-daily-local.yml` is used to test locally CI settings.

```bash
$ act -j build_local_linux -e "./.github/workflows/testing/push.json"
```