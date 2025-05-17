#!/bin/sh

# select a draft
echo "drafts available:"

drafts=($(ls ./_drafts | grep -v template))
for i in "${!drafts[@]}"; do
    echo "$i: ${drafts[$i]}"
done
read -p "Enter post to publish: " file_index

# get filename from array
originalfilename=${drafts[$file_index]}

# update draft filename with current date
result=$(echo "$originalfilename" | cut -c12-)
postdate=$(date +%Y-%m-%d-)
newfilename="$postdate$result"

# move draft to posts 
echo
mv -v ./_drafts/$originalfilename ./_posts/$newfilename

# add to git
git add "./_drafts/$originalfilename"
git add "./_posts/$newfilename"
git add "./public/images/$(date +%Y-%m)/"
git commit
git push