# Local testing of GitHub Actions
Leverage the knowledge from https://github.com/nektos/act for detailed instructions.

## Install
### 1. Install Docker
Required to run GitHub Actions on VMs. Choose your preferred Docker setup https://docs.docker.com/get-docker/.

### 2. Install Nektos
Required to run GitHub Actions locally. 

```bash
brew install nektos/tap/act
```

### 3. Install Azure CLI
Required to integrate GitHub Actions and Azure.

```bash
azure login
```

## Configure
1. The `.actrc` file contains the default configuration and run methods. 
2. Run this Bash script `ci-act-event.sh` to dynamically generate the required configuration file for Act. Two questions will be asked to collect the local git branch name and GitHub event. An example might look like `.github/workflows/testing/push.json` where "push" is the github.event to trigger a GitHub Action against the branch named inside that same file.  This file is `.gitignored` so it will need regenerated for testing.

```bash
cd .github/workflows/testing
bash ci-act-event.sh
```

A new file `{some-name}.json` will be generated inside `/testing/`.  This is the local git branch that `Act` will run.

Run the event from the `/testing/*` folder as indicated with `-W` or `--workflows` arguments.

```bash
$ act -e `.github/workflows/testing/${github_event}.json` -W "./.github/workflows/testing/"
```

## Test
`./.github/workflows/testing/ci-daily-local.yml` is used to test locally CI settings.

Run this command from root
```bash
$ act -j build_local_linux -e "./.github/workflows/testing/${github_event}.json"  -W "./.github/workflows/testing/"
```
## Cleanup
When installing packages on docker instances, if versions change, it's important to kill the docker instance and rebuild.

Determine what instances are running.
```bash
$ docker ps
```

Copy and paste the "CONTAINER ID" as the argument of `kill`.
```bash
$ docker kill 2ecf895e7be3
```

Remove the image.
```bash
$ docker rm 2ecf895e7be3
```

