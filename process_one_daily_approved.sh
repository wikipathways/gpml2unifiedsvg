batch_name="$1"
target_dir="$2"
raw_gpmlfile="$3"

wpid=$(echo "$raw_gpmlfile" | awk -F_ '{print $(NF-1)}');

# gpmlconverter can't handle apostrophes in filename
gpmlfile="$(echo "$raw_gpmlfile" | sed "s/'//g")"
if [ "$raw_gpmlfile" != "$gpmlfile" ]; then
  1>&2 echo -e "\"filename_has_apostrophe\"\t\"$wpid\"\t\"$raw_gpmlfile\""
  mv "$raw_gpmlfile" "$gpmlfile"
fi

if [ -s "$target_dir/$wpid".svg ]; then
  echo "Skipping $gpmlfile -- $target_dir/$wpid.svg already exists"
else
  echo "Processing $wpid"
  PATH="/data/project/wikipathways2wiki/www/js:/data/project/wikipathways2wiki/.npm-global/bin:/data/project/wikipathways2wiki/.linuxbrew/bin:$PATH"; \
  ~/GPMLConverter/bin/gpmlconverter --id $wpid "$gpmlfile" "$batch_name/$wpid.svg"
  if [ -s "$batch_name/$wpid".svg ]; then
    cp "$batch_name/$wpid".* "$target_dir"
  else
    1>&2 echo -e "\"gpml_to_svg_conversion_failed\"\t\"$wpid\"\t\"$gpmlfile\""
  fi
fi
