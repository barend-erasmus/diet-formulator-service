// Imports
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import * as request from 'request-promise';
import * as yargs from 'yargs';
import { config } from './config';
import { ApplicationRouter } from './routes/application';
import { DietRouter } from './routes/diet';
import { DietGroupRouter } from './routes/diet-group';
import { FormulatorRouter } from './routes/formulator';
import { IngredientRouter } from './routes/ingredients';
import { NutrientRouter } from './routes/nutrient';
import { UserRouter } from './routes/user';

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors());

app.get('/api/user/info', UserRouter.info);

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
app.get('/api/diet/find', requireUser, DietRouter.find);
app.get('/api/diet/list', requireUser, DietRouter.list);
app.post('/api/diet/update', requireUser, DietRouter.update);

app.post('/api/ingredient/create', requireUser, IngredientRouter.create);
app.get('/api/ingredient/list', requireUser, IngredientRouter.list);

app.post('/api/formulator/create', requireUser, FormulatorRouter.create);

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

function requireUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
    request({
        headers: {
            Authorization: req.get('Authorization'),
        },
        json: true,
        uri: `${argv.prod ? 'https://api.suite.worldofrations.com' : 'http://localhost:3000'}/api/user/info`,
    }).then((result) => {
        req['user'] = result;

        next();
    }).catch((err) => {
        res.status(401).end();
    });
}

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
