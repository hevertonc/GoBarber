import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/:year/:month',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
      month: Joi.number().max(12),
      year: Joi.number(),
    },
  }),
  providerMonthAvailabilityController.index,
);
providersRouter.get(
  '/:provider_id/:year/:month/:day',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
      day: Joi.number().max(31),
      month: Joi.number().max(12),
      year: Joi.number(),
    },
  }),
  providerDayAvailabilityController.index,
);

export default providersRouter;
