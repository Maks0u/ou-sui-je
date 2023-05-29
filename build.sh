#!/bin/bash

rm -dr build/*
rsync -v index.html build/index.html
rsync -v setup.html build/setup.html
rsync -v icon.png build/icon.png

esbuild app.js --bundle --platform=node --target=esnext --format=cjs --minify --outfile=build/${1}@${2}.js
