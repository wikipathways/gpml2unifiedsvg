batch_name="$1"
target_dir="$2"
gpmlfile="$3"

wpid=$(basename -s .gpml "$gpmlfile");
pathway_version=$(<"$gpmlfile".rev)
if [ -s "$target_dir/$wpid".svg ]; then
  echo "Skipping $gpmlfile -- $target_dir/$wpid.svg already exists"
else
  echo "Processing $wpid"
  PATH="/data/project/wikipathways2wiki/www/js:/data/project/wikipathways2wiki/GPMLConverter/bin:/data/project/wikipathways2wiki/.npm-global/bin:/data/project/wikipathways2wiki/.linuxbrew/bin:$PATH"; \
  ~/GPMLConverter/bin/gpmlconverter --id "$wpid" --pathway-version "$pathway_version" "$gpmlfile" "$batch_name/$wpid.svg"
  if [ -s "$batch_name/$wpid".svg ]; then
    cp "$batch_name/$wpid".* "$target_dir"
  else
    1>&2 echo -e "\"gpml_to_svg_conversion_failed\"\t\"$wpid\"\t\"$gpmlfile\""
  fi
fi
