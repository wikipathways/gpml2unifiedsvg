#!/usr/bin/env bash

echo $(echo "{"; \
tail -n +2 datasources.tsv | awk -F'\t' '{ print "\""$1"\":", "\""$6"\"" }' | paste -sd,; \
echo "}";) | jq .

# ./bridgedb2entity_identified.sh > bridgedb2entity_identified.json
