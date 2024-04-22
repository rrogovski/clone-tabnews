#!/bin/bash

function cleanup {
    npm run services:stop
    kill $(lsof -t -i:3000)
    exit 0
}

trap cleanup INT

npm run services:up && next dev