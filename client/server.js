const express = require('express');

const app = express();
app.use(express.static(__dirname + '/dist/client'));
app.get('/*', function (req, res) {
	res.sendFile(__dirname + '/dist/client/index.html');
});
app.listen(4200);
