# Bloggity Design

- generic definitions for post types
    - post types defined as basic objects
        {
            templateEngine: 'handlebars'
            postTypes: [
                {
                    name
                    type
                    path: /local/dir/src
                    template: /local/template/location
                    taxonomies: [
                        "tags",
                        "categories"
                    ]
                }
            ]
        }

- all post types support a `series` meta component for each post

    ```json
    {
        name: 'post title',
        author: 'post author',
        _draft: bool
        published: '12-24-2014',
        series: 'alias of series',
        tags: []
        categories: []
    }
    ```
- `series` accepts a named alias which generates a table of contents module at the beginning or end of a given article page

- published can be a past/future date
    - past dates are immediately "published"
    - future dates are ignored until "published"
    - draft or _draft is a reserved value to force ignore during publishing
