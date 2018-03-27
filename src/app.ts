import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as path from 'path';
import * as winston from 'winston';
import * as yargs from 'yargs';

import { AuthenticationMiddleware } from './middleware/authentication';
import { RateLimitingMiddleware } from './middleware/rate-limiting/rate-limiting';
import { DietRouter } from './routes/diet';
import { DietGroupRouter } from './routes/diet-group';
import { FormulationRouter } from './routes/formulation';
import { IngredientRouter } from './routes/ingredients';
import { MailRouter } from './routes/mail';
import { NutrientRouter } from './routes/nutrient';
import { SubscriptionRouter } from './routes/subscription';
import { SuggestedValueRouter } from './routes/suggested-value';
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
        new (winston.transports.File)({ filename: 'web.log' }),
      ],
}));

app.get('/api/user/info', RateLimitingMiddleware.limit, UserRouter.info);
app.put('/api/user/update', RateLimitingMiddleware.limit, UserRouter.update);

app.post('/api/subscription/create', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SubscriptionRouter.create);
app.get('/api/subscription/find', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SubscriptionRouter.find);
app.post('/api/subscription/notify', RateLimitingMiddleware.limit, SubscriptionRouter.notify);
app.post('/api/payment/notify', RateLimitingMiddleware.limit, SubscriptionRouter.notify);

app.post('/api/nutrient/create', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.create);
app.get('/api/nutrient/find', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.find);
app.get('/api/nutrient/list', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.list);
app.put('/api/nutrient/update', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, NutrientRouter.update);

app.post('/api/dietgroup/create', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.create);
app.get('/api/dietgroup/find', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.find);
app.get('/api/dietgroup/list', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.list);
app.get('/api/dietgroup/listAll', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.listAll);
app.put('/api/dietgroup/update', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietGroupRouter.update);

app.post('/api/diet/create', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.create);
app.get('/api/diet/find', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.find);
app.get('/api/diet/list', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.list);
app.put('/api/diet/update', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, DietRouter.update);

app.post('/api/ingredient/create', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, IngredientRouter.create);
app.get('/api/ingredient/list', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, IngredientRouter.list);

app.post('/api/formulation/create', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.create);
app.get('/api/formulation/find', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.find);
app.get('/api/formulation/list', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.list);
app.get('/api/formulation/composition', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.composition);
app.get('/api/formulation/supplement', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, FormulationRouter.supplement);

app.post('/api/suggestedvalue/create', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SuggestedValueRouter.create);
app.get('/api/suggestedvalue/find', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SuggestedValueRouter.find);
app.get('/api/suggestedvalue/findById', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SuggestedValueRouter.findById);
app.get('/api/suggestedvalue/list', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SuggestedValueRouter.list);
app.delete('/api/suggestedvalue/remove', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SuggestedValueRouter.remove);
app.put('/api/suggestedvalue/update', RateLimitingMiddleware.limit, AuthenticationMiddleware.shouldBeAuthenticated, SuggestedValueRouter.update);

app.post('/api/mail/send', RateLimitingMiddleware.limit, MailRouter.send);

// app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
// app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});

export {
    app,
};
