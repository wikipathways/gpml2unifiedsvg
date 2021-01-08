#!/usr/bin/env bash

# see https://stackoverflow.com/a/246128/5354298
get_script_dir() { echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"; }
SCRIPT_DIR=$(get_script_dir)

batch_name="WP4542";
echo "Batch processing results to $SCRIPT_DIR/$batch_name"
if [ ! -d "$batch_name" ]; then
	wget -O "$batch_name.zip" \
	  'https://www.wikipathways.org//wpi/batchDownload.php?species=Homo%20sapiens&fileType=gpml&tag=Curation:AnalysisCollection';
	unzip -d "$batch_name" "$batch_name.zip";
	rm -rf "$batch_name.zip"
else
	echo "Using previously downloaded $batch_name"
fi

#for gpmlfile in $(ls -1 $batch_name/*.gpml | head -n 2); do echo $gpmlfile; done
#for gpmlfile in $(ls -1 $batch_name/*.gpml | grep WP106); do echo $gpmlfile; done

for gpmlfile in $batch_name/*.gpml; do
  wpid=$(echo $gpmlfile | sed -E 's#.*(WP[0-9]+)_([0-9]+).*#\1#');
  version=$(echo $gpmlfile | sed -E 's#.*(WP[0-9]+)_([0-9]+).*#\2#');
  echo "Processing $wpid version $version"
  PATH="$(pwd):$PATH"; ~/GPMLConverter/bin/gpmlconverter --id $wpid --pathway-version $version "$gpmlfile" "$batch_name/$wpid_$version.svg"
done
