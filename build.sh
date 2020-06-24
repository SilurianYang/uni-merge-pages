#!/bin/bash

rm -rf ./npm-package
mkdir npm-package
cp -avx ./* ./npm-package
rm -rf ./npm-package/node_modules
rm -rf ./npm-package/example
rm -rf ./npm-package/npm-package
rm -rf ./npm-package/package-lock.json
rm -rf ./npm-package/build.sh
