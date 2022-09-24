import express, { urlencoded } from 'express';
import routes from './routes/index';
import handlebars, { engine, create } from 'express-handlebars';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

app.engine('.hbs', engine({extname: '.hbs', defaultLayout: 'template', layoutsDir: path.join(__dirname, 'views/layouts')}));
app.set('view engine', '.hbs');
app.set('views', './src/views');


// add cors!

app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', {layout: false});
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});

export default app;