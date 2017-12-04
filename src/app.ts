// Imports
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { config } from './config';
import { ApplicationRouter } from './routes/application';
import { DietGroupRouter } from './routes/diet-group';
import { NutrientRouter } from './routes/nutrient';
import { DietRouter } from './routes/diet';
import { IngredientRouter } from './routes/ingredients';

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());

app.post('/api/application/create', requireUser, ApplicationRouter.create);

app.post('/api/nutrient/create', requireUser, NutrientRouter.create);
app.get('/api/nutrient/find', requireUser, NutrientRouter.find);
app.get('/api/nutrient/list', requireUser, NutrientRouter.list);
app.post('/api/nutrient/update', requireUser, NutrientRouter.update);

app.post('/api/dietgroup/create', requireUser, DietGroupRouter.create);
app.get('/api/dietgroup/find', requireUser, DietGroupRouter.find);
app.get('/api/dietgroup/list', requireUser, DietGroupRouter.list);
app.get('/api/dietgroup/listAll', requireUser, DietGroupRouter.listAll);
app.post('/api/dietgroup/update', requireUser, DietGroupRouter.update);

app.post('/api/diet/create', requireUser, DietRouter.create);
app.get('/api/diet/list', requireUser, DietRouter.list);

app.post('/api/ingredient/create', requireUser, IngredientRouter.create);
app.get('/api/ingredient/list', requireUser, IngredientRouter.list);

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

function requireUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
    // request({
    //     uri: 'https://developersworkspace.auth0.com/userinfo',
    //     headers: {
    //         'Authorization': req.get('Authorization'),
    //     },
    //     json: true,
    // }).then((result) => {
    //     req['user'] = result;
    //     next();
    // }).catch(function (err) {
    //     res.status(401).end();
    // });

    next();
}

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
