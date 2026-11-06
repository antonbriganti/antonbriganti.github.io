# Anton's Blog

Exactly what it says. If you want to read my posts without going to the site, check the `_posts` directory. 
Built using [Layon for Jeyll](https://github.com/antonbriganti/antonbriganti.github.io).



## Image carousels

Posts can include a swipeable, arrow-navigable image carousel by adding a
`carousel:` list to the post's front matter and dropping the `carousel`
include into the body:

```yaml
---
layout: post
contentDir: /public/images/2024-07/my-post/
carousel:
  - cover.jpg
  - src: screenshot-1.png
    caption: The first screenshot.
    alt: Menu screen
  - src: screenshot-2.png
    caption: The second screenshot.
---
```

```liquid
{% include carousel.html %}
```

Each item is either a path string or a map with `src` (required) and optional
`caption`/`alt`. Relative paths are resolved against `contentDir`, so you can
just list filenames. Absolute paths (`/...`) and full URLs are used as-is.

### Multiple carousels in one article

Define each set under a `carousels:` map keyed by a name, then include the one
you want wherever it belongs in the body:

```yaml
---
layout: post
contentDir: /public/images/2024-07/guild0102-retro/
carousels:
  guild01:
    - aeroporter.jpeg
    - src: aeroporter-screen.jpg
      caption: The airport spans both screens.
  guild02:
    - crimson.jpeg
    - liberation.jpg
---
```

```liquid
{% include carousel.html name="guild01" %}

Some prose between the galleries.

{% include carousel.html name="guild02" label="Guild02 screenshots" %}
```

You can also pass a list variable directly:

```liquid
{% include carousel.html images=page.carousels.guild02 %}
```

Every carousel on the page is initialised and controlled independently, and
`label`/`name` are used to give each one a distinct accessible name.

### Declaring images inline instead of in front matter

You don't need front matter. Pass the images as a string to `images`:

```liquid
{% include carousel.html images="cover.jpg, screenshot-1.png, screenshot-2.png" %}
```

Add captions (and optionally alt text) with pipes:

```liquid
{% include carousel.html images="cover.jpg | The cover, screenshot-1.png | First playthrough" %}
```

For longer sets, or captions containing commas, use a `capture` block with one
entry per line:

```liquid
{% capture trip %}
cover.jpg | The cover
day1.jpg | Day one
day2.jpg
{% endcapture %}
{% include carousel.html images=trip %}
```

Relative paths still resolve against `contentDir`, so inline declarations need
the same `contentDir:` in front matter (or use absolute `/public/...` paths).

> **Why not a `{% raw %}{% carousel %}...{% endcarousel %}{% endraw %}` tag?** That
> needs a Ruby plugin in `_plugins/`, which GitHub Pages ignores unless you
> deploy via GitHub Actions. The include approach above works with plain Jekyll.

Slides support drag/swipe, clickable prev/next arrows, dot navigation,
left/right arrow keys when focused, respects `prefers-reduced-motion`, and is
keyboard/screen-reader accessible. Layout lives in `_includes/carousel.html`,
behaviour in `public/js/carousel.js`, and styling at the end of
`public/css/lanyon.css`.

## License

Open sourced under the [MIT license](LICENSE.md).

