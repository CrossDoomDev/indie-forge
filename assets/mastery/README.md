# Mastery illustrations and icons

The catalogue uses 98 individually illustrated WebP covers: 13 technologies in `technologies/` and 85 courses in `courses/`. The original artwork was generated with `image_gen`, using the supplied fantasy game and developer-studio references for art direction. Course scenes depict their own topics instead of repeating the technology background.

Production files use lossless WebP. The atlas tiles were extracted without rescaling; decoded pixels were compared with their source crops. `artwork-manifest.json` records dimensions, hashes, source atlases and crop coordinates; `generation-prompts.json` contains the generation instructions. Technology covers have a 2:1 ratio; course covers are 16:9. Original generation atlases remain in the session's generated-images folder.

The former simple SVG illustrations remain available for compatibility with explicitly authored image URLs. Previously saved catalogues automatically receive new covers only where known built-in defaults were used. Uploaded images, custom links, descriptions, lessons, visibility and ordering are preserved. Covers can still be replaced through each record's `image` field or the admin form.

The `logo-*.svg` files are from Simple Icons v11 (https://simpleicons.org/), distributed under CC0. Source: https://cdn.jsdelivr.net/npm/simple-icons@11/icons/. Technology names and logos identify their respective products; their trademark rights remain with their owners.
