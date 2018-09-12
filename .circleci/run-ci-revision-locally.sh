#!/usr/bin/env bash

# Debugging locally
# For complete details visit https://circleci.com/docs/2.0/examples/#video-test-your-config-file-locally 

# 1. $ export CIRCLE_CI_TOKEN=some-value-created-by-personal-ci-account
# 2. $ cd ./.circleci
# 3. $ circleci config validate -c config.yml
# 4. $ bash run-build-locally.sh
# 5. Visit https://circleci.com/gh/Microsoft to see the running build just executed by the above steps
 
curl --user ${CIRCLE_CI_TOKEN}: \
    --request POST \
    --form revision=8dc89ace80d63252c606240619f0ea9b2537a9c2 \
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/Microsoft/fast-dna/tree/master
