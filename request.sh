#!/usr/bin/env bash

ts = $(curl -X GET 'https://testnet.binance.vision/api/v3/time' | grep -Eo '[0-9]+')

sig = $("timestamp={tsah}" | openssl dgst -sha256 -hmac "L6kenliJi7CeD48DNabVynGpATGGZlqJRQArbQljwwDJO38oyz11n04TanT77aye")

curl -H "X-MBX-APIKEY: IGxgRh6B4rwmi6TDdv8IpMHgsrqJaSu0tdc0qvIYX6b4T9mnJaCHWVW8qH2Ds8Nc" -X GET 'https://testnet.binance.vision/api/v3/account?timestamp=1626727605640&signature=${sig}'

