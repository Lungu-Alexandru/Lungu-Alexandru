import Joi from 'joi';

export const validatePaymentIntent = (data: any) => {
  const schema = Joi.object({
    eventId: Joi.string().required(),
    ticketTypeId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).max(8).required(),
    totalAmount: Joi.number().positive().required(),
  });

  return schema.validate(data);
};

export const validateRefund = (data: any) => {
  const schema = Joi.object({
    ticketId: Joi.string().required(),
    reason: Joi.string().max(500).required(),
  });

  return schema.validate(data);
};