#!/usr/bin/env bash
# To debug code coverage run with bash and debug (-x) from the directory root
# $ bash -x .circleci/run-coverage-locally.sh

# Prebuilt Binaries
# Choose a binary below that matches your build environment.
# Linux : https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64gi
# MacOS : https://codeclimate.com/downloads/test-reporter/test-reporter-latest-darwin-amd64 

# Setup Exports
# // TODO #427: hide values and provide details on where to find these.
# $ export CC_TEST_REPORTER_ID=08a773cb4ea5811add5a45e12873e5cd2634c005568705cc37abfd5217617a32
# $ export CIRCLE_CI_TOKEN=fb829683ff3896003eda260b82bf90e1d6e10051

# Setup Code Climate test-reporter
# If the package is not found then download from internet and set appropriate permissions
if [ ! -f ./coverage/cc-test-reporter ]; then
    mkdir -p coverage/
    curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-darwin-amd64 > ./coverage/cc-test-reporter
    chmod +x ./coverage/cc-test-reporter
fi

# Code Coverage
# Notify Code Climate that a build is about to start
# Add --debug to cc-test-reporter when necessary
./coverage/cc-test-reporter before-build

for f in packages/*; do
  if [ -d "$f" ]; then
    echo $f
    if [ -d "$f/coverage" ]; then
      ./coverage/cc-test-reporter format-coverage -t lcov -o coverage/coverage.${f//\//-}.json $f/coverage/lcov.info
    fi
  fi
done;

./coverage/cc-test-reporter sum-coverage -o coverage/coverage.total.json coverage/coverage.*.json
./coverage/cc-test-reporter upload-coverage -i coverage/coverage.total.json
#./coverage/cc-test-reporter after-build --coverage-input-type lcov --exit-code $?