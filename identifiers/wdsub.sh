while IFS= read -r id; do
  echo "$id";
  wd_sub=$(wd query -p P4793 -o "$id");
  echo "$wd_sub";
  echo "$id|$wd_sub" >> identifiers2wd_subs.tsv;
done < identifiers.tsv
