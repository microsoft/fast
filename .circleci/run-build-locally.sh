#!/usr/bin/env bash
curl --user ${CIRCLE_CI_TOKEN}: \
    --request POST \
    --form revision=403b42af280ec3023a06826f4edaceda8a1f8a2d\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/Microsoft/fast-dna/tree/master
