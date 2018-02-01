import * as request from 'supertest';
import { app } from '../app';

// describe('POST /api/formulation/create', () => {
//     it('respond with json', (done) => {
//         request(app)
//             .post('/api/formulation/create')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200, done);
//     });
// });