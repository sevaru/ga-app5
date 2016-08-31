const ghpages = require('gh-pages');
const path = require('path');
 
ghpages.publish(
	path.join(__dirname, 'build'), 
	err => console.log('Problem with publishing to gh-pages', err)
);