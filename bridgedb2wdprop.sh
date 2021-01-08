#!/usr/bin/env bash

echo $(echo "{"; \
tail -n +2 datasources.tsv | awk -F'\t' '{if ($12!="") { print "\""$1"\":", "\""$12"\"" }}' | paste -sd,; \
echo "}";) | jq .

# ./bridgedb2wdprop.sh > bridgedb2wdprop.json
