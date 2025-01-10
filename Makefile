create:
	./scripts/create-draft.sh

publish:
	./scripts/publish-draft.sh

start-local-server:
	# make more portable, requires ruby+jekyll+jekyll-paginate
	jekyll serve -D -P 3001
	