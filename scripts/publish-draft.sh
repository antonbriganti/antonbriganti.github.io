#!/bin/sh

# select a draft
echo "drafts available:"
ls ./_drafts | grep -v template
read -p "Enter post to publish: " originalfilename

# update draft filename with current date
result=$(echo "$originalfilename" | cut -c12-)
postdate=$(date +%Y-%m-%d-)
newfilename="$postdate$result"

# move draft to posts 
echo
mv -v ./_drafts/$originalfilename ./_posts/$newfilename