# URL SCHEME FOR BLOGGITY


## Root/Home page
- `/`     (home)
    - Can be anything you want!
    - List articles from your blog
    - list other post types here,
    - Add social media stuffs,
    - Add other 3rd party API stuffs using JS
        - Flickr
        - Github
        - Instagram
        - Etc.
    - TODO: figure out extension for 3rd party content integration


## Stock blog implementation
- `/blog`
    - A list of the most recent blog articles
- `/blog/:postname`
    - Actual location of post content
- `/blog/archives`
    - A paged collection of post listings
- `/blog/archives/:pagenum`
    - A paged index of post listings
- `/blog/authors`
    - A list of each author that has contributed to the site
- `/blog/authors/:authorname`
    - A paged collection of posts contributed by the author
- `/blog/categories/`
    - A list of categories
- `/blog/categories/:category`
    - A paged collection of categorized post listings
- `/blog/tags`
    - A list of tags
- `/blog/tags/:tagname`
    - A paged collection of tagged post listings


## Demo project/portfolio post type schema
- `/projects`
    - A paged collection of project listings
- `/projects/:project`
    - Actual location of project content
- `/projects/authors`
    - A list of each author that has contributed to the site
- `/projects/authors/:authorname`
    - A paged collection of projects contributed by the author
- `/projects/tools`
    - A list of tools
- `/projects/tools/:toolname`
    - A paged collection of project tools listings
- `/projects/tags`
    - A list of tags
- `/projects/tags/:tagname`
    - A paged collection of tagged post listings
- `/projects/categories`
    - A list of categories
- `/projects/categories/:categoryname`
    - A paged collection of categorized post listings

