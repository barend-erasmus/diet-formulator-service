// Imports
import * as express from 'express';
import * as path from 'path';
import * as yargs from 'yargs';
import { config } from './config';

// Import Repositories
import { BaseRepository } from './repositories/sequelize/base';
// import { SurveyRepository } from './repositories/sequelize/survey';

// Imports middleware
import * as bodyParser from 'body-parser';

// Imports routes
// import { SurveyRouter } from './routes/survey';
// import { UIRouter } from './routes/ui';

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


// app.post('/api/survey/create', requireUser, SurveyRouter.create);


app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});


