#!/bin/bash

# Script to stop all services

echo "Stopping all services..."

if [ -f .pids ]; then
    PIDS=$(cat .pids)
    for PID in $PIDS; do
        if ps -p $PID > /dev/null 2>&1; then
            echo "Stopping process $PID..."
            kill $PID
        fi
    done
    rm .pids
    echo "All services stopped."
else
    echo "No .pids file found. Stopping processes manually..."
    pkill -f "dotnet run" || true
    pkill -f "next dev" || true
    pkill -f "ng serve" || true
    echo "Done."
fi

