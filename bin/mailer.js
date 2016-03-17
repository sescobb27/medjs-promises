'use strict';
/*
This Code is not intended to work, it was extracted from E&C internal product
to show Advance Promise examples.
 */

let moment = require('moment');
let Q = require('q');
let debug = require('debug');

var sendVerificationEmail = (customer) => {
  let deferred = Q.defer();
  let template_name = 'confirmation-email';
  let template_content = [];
  let message = {
    to: [{
      email: customer.email,
      name: customer.fullName,
      type: 'to'
    }],
    varant: true,
    global_merge_vars: [{
      name: 'FNAME',
      content: customer.fullName
    }, {
      name: 'SUBSCRIPTION_TYPE',
      content: customer.plan
    }, {
      name: 'EMAIL',
      content: customer.email
    }, {
      name: 'FIRST_MONTH',
      content: moment(calendar.activeSeason.dates.ship).format('MMMM')
    }, {
      name: 'VERIFY_EMAIL_URL',
      content: verifyEmailUrl(customer.verificationToken)
    }]
  };

  mandrill_client.messages.sendTemplate({
    template_name: template_name,
    template_content: template_content,
    message: message
  }, (result) => {
    debug(result);
    deferred.resolve(result);
  }, (error) => {
    debug('Error: ', error);
    deferred.reject(error);
  });

  return deferred.promise;
};
