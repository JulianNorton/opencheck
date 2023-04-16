#!/bin/bash

# Find the process ID of the running Node.js application
pid=$(pgrep -f "node server.js")

if [ "$pid" != "" ]; then
    # Stop the running Node.js process
    kill "$pid"
fi

# Start the Node.js application in the background
nohup node server.js > app.log 2>&1 &


