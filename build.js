// TODO: нужен ли этот файл?
var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');

var compiler = webpack(config);

compiler.run(function( err, stats ) {
	console.log(err);
});

compiler.watch({
    aggregateTimeout: 300,
    poll: true
}, function( err, stats ) {
	console.log(err);
});