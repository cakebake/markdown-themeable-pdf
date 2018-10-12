#!/bin/sh

echo "Using Atom version:"
atom -v
echo "Using APM version:"
apm -v

echo "Downloading package dependencies..."
apm clean
rm -rvf ./node_modules

export NPM_SCRIPT_PATH="npm"
apm install

# Use the system NPM to install the devDependencies
echo "Using Node version:"
node --version
echo "Using NPM version:"
npm --version
echo "Installing remaining dependencies..."
npm install

if [ -d ./lib ]; then
  echo "Linting package using eslint..."
  ./node_modules/.bin/eslint lib
  rc=$?; if [ $rc -ne 0 ]; then exit $rc; fi
fi
if [ -d ./spec ]; then
  echo "Linting package specs using eslint..."
  ./node_modules/.bin/eslint spec
  rc=$?; if [ $rc -ne 0 ]; then exit $rc; fi
fi

if [ -d ./spec ]; then
  echo "Running specs..."
  atom --test spec
elif [ -d ./test ]; then
  echo "Running specs..."
  atom --test test
else
  echo "Missing spec folder! Please consider adding a test suite in './spec' or in './test'"
  exit 0
fi
exit
