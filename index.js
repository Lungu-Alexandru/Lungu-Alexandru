const express = require('express');
const app = express();
const port = 3000;
const indexRouter = require('./routes/index');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
