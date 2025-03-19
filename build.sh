#!/usr/bin/env bash

cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" .
GOOS=js GOARCH=wasm go build -o main.wasm main.go
node gzip.js
rm main.wasm