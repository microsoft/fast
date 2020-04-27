#!/bin/bash

# Set Environment
##  Set Code Climate Test Reporter ID
export CC_TEST_REPORTER_ID="08a773cb4ea5811add5a45e12873e5cd2634c005568705cc37abfd5217617a32"
echo $CC_TEST_REPORTER_ID

## Set Git Branch
#export GIT_BRANCH=$(git symbolic-ref --short HEAD)
export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "GIT_BRANCH: $GIT_BRANCH"

## Set with verify to ensure usable as a single, valid object name, otherwise abort
export GIT_COMMIT_SHA=$(git log -1 --pretty=format:%H)
echo "GIT_COMMIT_SHA: $GIT_COMMIT_SHA"

## Set 
export GIT_COMMITTED_AT=$(git log -1 --pretty=format:%ct)
echo "GIT_COMMITTED_AT: $GIT_COMMITTED_AT"

# Download and prepare Code Climate cc-test-reporter
if [ ! -f ./coverage/cc-test-reporter ]; then
    mkdir -p coverage/
    curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-darwin-amd64 > ./coverage/cc-test-reporter
    # Run on Linux on CI
    # curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./coverage/cc-test-reporter
    chmod +x ./coverage/cc-test-reporter
fi
    
# Notify Code Climate that a build is starting
./coverage/cc-test-reporter before-build

# 1. execute test suite
# Collect coverage reports

# coverage/cc-test-reporter format-coverage ./packages/react/fast-components-foundation-react/coverage/lcov.info --input-type lcov --output coverage/coverage.fast-components-foundation-react.json -d

# #--prefix ../packages/react/fast-components-foundation-react/coverage


for f in packages/react/*; do
    if [ -d "$f" ]; then
        set +e
        if [ -d "$f/coverage" ]; then
            echo $f
            #cat $f/coverage/coverage-final.json
            ./coverage/cc-test-reporter format-coverage \
            --debug \
            --prefix /Users/awentzel/aMicrosoft/Projects/fast-dna \
            --add-prefix fast-dna \
            --output /Users/awentzel/aMicrosoft/Projects/fast-dna/coverage/coverage.${f//\//-}.json \
            --input-type lcov /Users/awentzel/aMicrosoft/Projects/fast-dna/$f/coverage/lcov.info
            
            exit
        fi
    fi
done

# 2. run format-coverage
# 3. run sum-coverage
# 4. run upload-coverage

# for f in packages/tooling/*; do
#     if [ -d "$f" ]; then
#     echo $f
#     set +e
#     if [ -d "$f/coverage" ]; then
#         ./coverage/cc-test-reporter format-coverage -t lcov -o coverage/coverage.${f//\//-}.json $f/coverage/lcov.info --debug
#     fi
# done

# for f in packages/utilities/*; do
#     if [ -d "$f" ]; then
#     echo $f
#     set +e
#     if [ -d "$f/coverage" ]; then
#         ./coverage/cc-test-reporter format-coverage -t lcov -o coverage/coverage.${f//\//-}.json $f/coverage/lcov.info --debug
#     fi
# done

# for f in packages/web-components/*; do
#     if [ -d "$f" ]; then
#     echo $f
#     set +e
#     if [ -d "$f/coverage" ]; then
#         ./coverage/cc-test-reporter format-coverage -t lcov -o coverage/coverage.${f//\//-}.json $f/coverage/lcov.info --debug
#     fi
# done

# # Summarize and upload code coverage
     
# ./coverage/cc-test-reporter sum-coverage -o coverage/coverage.total.json coverage/coverage.*.json --debug
# ./coverage/cc-test-reporter upload-coverage -i coverage/coverage.total.json --debug
