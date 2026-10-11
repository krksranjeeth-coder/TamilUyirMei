#!/bin/bash
cd "$(dirname "$0")"

PORT=3333
echo "=================================================="
echo "  தமிழ் உயிர்மெய் பயிலரங்கம்"
echo "  TamilUyirMei Lab Local Server"
echo "=================================================="
echo ""
echo "Starting local server at http://localhost:$PORT..."

# Start python HTTP server in background
python3 -m http.server $PORT &
SERVER_PID=$!

sleep 1

# Open in default browser (Chrome / Safari)
open "http://localhost:$PORT/index.html"

echo "Server running (PID: $SERVER_PID)."
echo "Press Ctrl+C to stop the server anytime."
echo "=================================================="

wait $SERVER_PID
