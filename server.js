const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

require('./db/db');

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));


const userRoutes = require('./controllers/userRoutes');
const photoRoutes = require('./controllers/photoRoutes');

app.use('/users', userRoutes);
app.use('/photos', photoRoutes);


app.listen(3000, () => {
  console.log('i am watching.......');
});
