import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as path from 'path';
import * as winston from 'winston';
import * as yargs from 'yargs';
import { config } from './config';
import { AuthenticationMiddleware } from './middleware/authentication';
import { DietRouter } from './routes/diet';
import { DietGroupRouter } from './routes/diet-group';
import { FormulationRouter } from './routes/formulation';
import { IngredientRouter } from './routes/ingredients';
import { NutrientRouter } from './routes/nutrient';
import { PaymentRouter } from './routes/payment';
import { SubscriptionRouter } from './routes/subscription';
import { UserRouter } from './routes/user';

const argv = yargs.argv;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.use(expressWinston.logger({
    meta: true,
    msg: '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
    transports: [
        new (winston.transports.File)({ filename: path.join(path.dirname(require.main.filename), 'web.log') }),
    ],
}));

app.get('/api/user/info', UserRouter.info);
app.post('/api/user/update', UserRouter.update);

app.get('/api/subscription/change', AuthenticationMiddleware.shouldBeAuthenticated, SubscriptionRouter.change);
app.get('/api/subscription/find', AuthenticationMiddleware.shouldBeAuthenticated, SubscriptionRouter.find);

app.get('/api/payment/create', AuthenticationMiddleware.shouldBeAuthenticated, PaymentRouter.create);
app.get('/api/payment/list', AuthenticationMiddleware.shouldBeAuthenticated, PaymentRouter.list);
app.get('/api/payment/verify', AuthenticationMiddleware.shouldBeAuthenticated, PaymentRouter.verify);

app.post('/api/nutrient/create', AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.create);
app.get('/api/nutrient/find', AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.find);
app.get('/api/nutrient/list', AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.list);
app.post('/api/nutrient/update', AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.update);

app.post('/api/dietgroup/create', AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.create);
app.get('/api/dietgroup/find', AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.find);
app.get('/api/dietgroup/list', AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.list);
app.get('/api/dietgroup/listAll', AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.listAll);
app.post('/api/dietgroup/update', AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.update);

app.post('/api/diet/create', AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.create);
app.get('/api/diet/find', AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.find);
app.get('/api/diet/list', AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.list);
app.post('/api/diet/update', AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.update);

app.post('/api/ingredient/create', AuthenticationMiddleware.shouldBeAuthenticated, IngredientRouter.create);
app.get('/api/ingredient/list', AuthenticationMiddleware.shouldBeAuthenticated, IngredientRouter.list);

app.post('/api/formulation/create', AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.create);
app.get('/api/formulation/find', AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.find);
app.get('/api/formulation/list', AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.list);
app.get('/api/formulation/composition', AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.composition);
app.get('/api/formulation/supplement', AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.supplement);
app.get('/api/formulation/suggestedValue', AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.suggestedValue);

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

export {
    app,
};
