#!/bin/bash

# Find the process ID of the running Node.js application
pid=$(pgrep -f "node app.js")

if [ "$pid" != "" ]; then
    # Stop the running Node.js process
    kill "$pid"
fi

# Start the Node.js application in the background
nohup node app.js > app.log 2>&1 &


