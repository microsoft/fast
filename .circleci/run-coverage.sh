#!/usr/bin/env bash
# To debug code coverage run with bash and debug (-x)
# $ bash -x ./fast-dna/.circleci/run-coverage.sh

# Prebuilt Binaries
# Choose a binary below that matches your build environment.
# Linux : https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64gi
# MacOS : https://codeclimate.com/downloads/test-reporter/test-reporter-latest-darwin-amd64 

# Setup Exports
# TODO: hide values and provide details on where to find these.
# $ export CC_TEST_REPORTER_ID=08a773cb4ea5811add5a45e12873e5cd2634c005568705cc37abfd5217617a32
# $ export CIRCLE_CI_TOKEN=fb829683ff3896003eda260b82bf90e1d6e10051

# Setup Code Climate test-reporter
# If the package is not found then download from internet and set appropriate permissions
if [ ! -f ./tmp/cc-test-reporter ]; then
    mkdir -p tmp/
    curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-darwin-amd64 > ./tmp/cc-test-reporter
    chmod +x ./tmp/cc-test-reporter
fi

# Code Coverage
# Notify Code Climate that a build is about to start
./tmp/cc-test-reporter before-build --debug

for f in packages/*; do
    if [ -d "$f" ]; then
        echo $f
        ./tmp/cc-test-reporter format-coverage -t lcov -o tmp/coverage.${f//\//-}.json $f/coverage/lcov.info --debug
    fi
done;

./tmp/cc-test-reporter sum-coverage -o tmp/coverage.total.json tmp/coverage.*.json --debug
./tmp/cc-test-reporter upload-coverage -i tmp/coverage.total.json --debug
