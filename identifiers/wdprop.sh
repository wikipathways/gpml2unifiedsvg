while IFS= read -r line; do
  id=$(echo $line | awk -F'|' '{print $1}');
  echo "$id";
  wd_sub=$(echo $line | awk -F'|' '{print $2}');
  echo "$wd_sub";
  wd_prop=$(wd query -s $wd_sub -p P1687);
  echo "$wd_prop";
  echo "$id|$wd_sub|$wd_prop" >> id2wdsub2wdprop.tsv;
done < identifiers2wd_subs.tsv
