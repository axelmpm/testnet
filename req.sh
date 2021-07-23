#!/bin/bash


URL=$(node index.js)

echo ${URL}

curl -H "Content-Type: application/json" -H "X-MBX-APIKEY: IGxgRh6B4rwmi6TDdv8IpMHgsrqJaSu0tdc0qvIYX6b4T9mnJaCHWVW8qH2Ds8Nc" -X GET ${URL}
