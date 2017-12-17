---
doc: missing-homepage
updated: '2017-08-05'
published: '2017-08-05'
---
# You're missing an `isHomepage` post

You must specify your homepage using the `isHomepage` property in your yaml frontmatter of your content pages.

## Example

```yaml
---
title: Page Title
isHomepage: true
...
---
Page content goes here...
```

You only need one file with this property for the `/` homepage to work correctly.