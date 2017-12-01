// Imports
import * as express from 'express';
import * as path from 'path';
import * as yargs from 'yargs';
import { config } from './config';
import * as bodyParser from 'body-parser';
import { DietGroupRouter } from './routes/diet-group';
import { ApplicationRouter } from './routes/application';

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/api/application/create', ApplicationRouter.create);

app.post('/api/dietgroup/create', DietGroupRouter.create);
app.get('/api/dietgroup/list', DietGroupRouter.list);

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});


