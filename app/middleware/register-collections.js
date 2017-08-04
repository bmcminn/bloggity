const _     = require('lodash');
const CJSON = require('circular-json');

function replacer() {
  var objects = [];

  return function(key, value) {
    if (typeof value === 'object' && value !== null) {
      var found = objects.some(function(existing) {
        return (existing === value);
      });

      if (found) {
        return '[Circular: ' + key + ']' + JSON.stringify(value, null, 2);
      }

      objects.push(value);
    }

    return value;
  };
}



module.exports = function(app) {

    let db      = app.get('db');
    let model   = app.get('model');


    let posts = db.get('posts')
        .sortBy('published')
        .value()
        ;


    let posttypes   = db.get('posttypes').value();


    _.each(posttypes, (posttype) => {

        // bail on page posttype
        if (posttype.name === 'page') { return; }


        let posttypePosts = _.filter(posts, { posttype: posttype.name });

        // posttypePosts = _.map(posttypePosts, (p) => {
        //     return p.route;
        // });

        let chunks = _.chunk(posttypePosts, model.paging.postCount);

        // console.log(chunks.length);

        _.each(chunks, (chunk, index) => {

            let page = {};

            page.posts = chunk;
            page.index = index + 1;

            // if this is the first chunk, set the route to /, else bump the index +1
            let tmpIndex = index === 0 ? '' : page.index;

            page.route      = `/${posttype.name}/${tmpIndex}`;
            page.template   = `pages/${posttype.name}-list`;
            // page.posttype   = posttype.name;

            // if the index page already exists in the DB, update it
            if (db.get('posts').find({ index: index+1 }).value()) {
                console.log('updating page index:', posttype.name, index+1);
                db.get('posts').find({ index: index+1 }).assign(page).write();

            // else push it into the posts collection
            } else {
                db.get('posts').push(page).write();
            }


            // console.log(CJSON.stringify(db.getState(), null, 2));

        });

        // console.log('post collection:', postCollection.length);

    });
};
