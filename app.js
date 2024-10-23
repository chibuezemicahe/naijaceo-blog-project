const express = require('express')
const app = express();

const router = require('./routes/feed');

app.use('blog', router);
app.listen('8080');