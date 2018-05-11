#!/usr/bin/env bash
curl --user ${CIRCLE_CI_TOKEN}: \
    --request POST \
    --form revision=38387d3e7a37b449ff958c43593e4e1a2fe42401 \
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/Microsoft/fast-dna/tree/master
