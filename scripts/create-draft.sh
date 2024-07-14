#!/bin/sh

# create new draft
draftdate=$(date +%Y-%m-%d-)
read -p "Enter file name: " filename
file="./_drafts/$draftdate$filename.md"
cp ./_drafts/_template.md $file

# setup content directory
mkdir "./public/images/$(date +%Y-%m)/$filename"

# fill in draft info
read -p "Enter title: " blogtitle
sed -i "" "s/!!Title!!/$blogtitle/g" "$file"
read -p "Enter description: " blogdescription
sed -i "" "s/!!Description!!/$blogdescription/g" "$file"
read -p "Enter tags (format: tag1, tag2, tag3): " blogtags
sed -i "" "s/!!Tags!!/$blogtags/g" "$file"
directory="$(date +%Y-%m)\/$filename"
sed -i "" "s/!!Directory!!/$directory/g" "$file"

# display blog post details
echo
echo "File: $file"
cat "$file"