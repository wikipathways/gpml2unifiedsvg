# GPML Conversion Tool

## Convert GPML to SVG

For test purposes, first try just converting one GPML file:

```
PATH="/data/project/wikipathways2wiki/www/js:/data/project/wikipathways2wiki/GPMLConverter/bin:/data/project/wikipathways2wiki/.npm-global/bin:/data/project/wikipathways2wiki/.linuxbrew/bin:$PATH"; ~/GPMLConverter/bin/gpmlconverter --id WP554 ./WP554/WP554.gpml ./WP554/WP554.svg
```

If that worked, convert them all:

1. Convert from Egon's SARS-CoV-2-WikiPathways repo:

```
nohup ./process_batch_SARS-CoV-2-WikiPathways > ~/logs/SARS-CoV-2-WikiPathways_gpml_"$(printf '%(%Y-%m-%d)T\n' -1)".log 2>&1 &
```

2. Convert all daily human approved:

```
nohup ./process_batch_daily_human_approved > ~/logs/daily_human_approved_gpml_"$(printf '%(%Y-%m-%d)T\n' -1)".log 2>&1 &
```

3. Release:

Check a sample pathway like WP554.

Parse and check the logs:

```
datenow="$(printf '%(%Y-%m-%d)T\n' -1)"
target_dir=public_"$datenow"
ISSUES_F="$target_dir/issues.log"
echo $'"error"\t"wpid"\t"notes"' > "$ISSUES_F"

grep 'filename_has_apostrophe' "$HOME"/logs/*_gpml_"$datenow".log | sort -u >> "$ISSUES_F"
grep 'gpml_to_svg_conversion_failed' "$HOME"/logs/*_gpml_"$datenow".log | sort -u >> "$ISSUES_F"

grep 'wikidata_property_missing' "$HOME"/logs/*_gpml_"$datenow".log | sort -u >> "$ISSUES_F"
grep 'wikidata_mapping_failed' "$HOME"/logs/*_gpml_"$datenow".log | sort -u >> "$ISSUES_F"
grep 'wikidata_ambiguous_mapping' "$HOME"/logs/*_gpml_"$datenow".log | sort -u >> "$ISSUES_F"

grep 'Missing Xref data source and/or identifier in WP' "$HOME"/logs/*_gpml_"$datenow".log |\
  sed -E 's#Missing Xref data source and/or identifier in (WP[0-9]+)#"xref_missing_datasource_or_identifier"\t"\1"\t""#' |\
  sort >> "$ISSUES_F"
```

If everything looks good, go live with latest updated batch:

```
rm public
ln -s "$target_dir" public
```

Check one or more sample pathways again like [WP554 with ACR highlighted red](https://pathway-viewer.toolforge.org/?id=WP554&red=ACE).

## Other

Why doesn't this work?
```
wd query -p P662 -o 65399
```

Need to use this format:
```
wd query -p P662 -o '"65399"'
```

But strangely, `convert` uses this format:
```
wd convert P662 65399 3973
```

## Scratchpad Notes

jq -r '[.entitiesById[] | select(.type | contains(["DataNode"])) | select(.xrefIdentifier and .xrefDataSource)] | reduce .[] as $item ([]; . + ["wd convert $(jq -r '"'"'.[\"" + $item["xrefDataSource"] + "\"]'"'"' mapper.json) " + $item["xrefIdentifier"]]) | .[] | tostring' WP3879.json

clear; rm daily_human_approved_gpml_2020-08-04/*.{svg,json,log}; nohup ./process_batch_daily_human_approved > ~/logs/daily_human_approved_gpml_2020-08-04.log 2>&1 &

rm WP554/WP554.*{css,json,svg}; PATH="$(pwd):$PATH"; ~/GPMLConverter/bin/gpmlconverter --id WP554 ./WP554/WP554.gpml ./WP554/WP554.svg

daily_human_approved_gpml_2020-12-14/Hs_Carnosine's_role_in_muscle_contraction_WP4486_103721.gpml

less ~/logs/daily_human_approved_gpml_2020-12-16.log 
