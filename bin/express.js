'use strict';
/*
This Code is not intended to work, it was extracted from E&C internal product
to show Advance Promise examples.
 */
let _ = require('lodash');
let Express = require('express');
let app = new Express();
let debug = require('debug');

app.post((req, res, next) => {
  let newCustomer = req.model;

  _.merge(newCustomer, Serializer.normalize(req.body.data.relationships), {
    customerType: 'subscriber'
  });

  let customer = null;
  return Customer.generateHash(newCustomer.password)
    .then((encryptedPassword) => {
      newCustomer.password = encryptedPassword;
      newCustomer.verificationToken = authService.verificationToken(newCustomer.email);
      return newCustomer;
    })
    .then((fullCustomer) => {
      return Customer.create(fullCustomer);
    })
    .then((customer) => {
      customer = dbCustomer;
      debug('customer email(%s) id(%s) created', customer.email, customer.id);
      debug('sending verification email to %s', customer.email);

      return mailer.sendVerificationEmail(customer)
    })
    .then(() => {
      req.logIn(customer, (error) => {
        if (error) {
          debug('Error: ', error);
          return res.status(400).json(errors.badrequestError({
            title: 'Uh! Oh! Login Error',
            detail: 'Uh! Oh! Login Error',
          }));
        }
        debug('customer email(%s) id(%s) logged in', customer.email, customer.id);

        const jsonapi = new CustomerSerializer(customer.toObject()).serialize();
        return res.status(201).send(jsonapi);
      });
    }, (error) => {
      if (stripeUtils.isStripeError(error)) {
        debug('Error: ', error);
        return res.status(422).send(stripeUtils.stripeErrorFormatter(error));
      } else {
        next(error);
      }
    });
})
