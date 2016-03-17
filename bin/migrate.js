'use strict';
/*
This Code is not intended to work, it was extracted from E&C internal product
to show Advance Promise examples.
 */

let _ = require('lodash');
let Q = require('q');
let debug = require('debug');
// New DataBase with New Schemas
let EcDomain = require('ec-domain');
let DB = EcDomain.db;

// Old DataBase with Old Schemas
let ECSiteSchemas = require('../lib/db/ecsite-schemas');
let ECModels = ECSiteSchemas.Models();

function mapProducts() {
  return new Promise();
}

function mapDetails() {
  return new Promise();
}

function mapAddress(addr) {
  return EcDomain.Address.create({
    line1: addr.address1,
    line2: addr.address2,
    city: addr.city,
    state: addr.state,
    country: addr.country.toUpperCase(),
    zip: addr.zipcode,
    customer: addr.customer
  });
}

// Never Broke The Contract
var cachedCollections = [];

function findCollections() {
  if (_.isEmpty(cachedCollections)) {
    return EcDomain.Collection.find({})
      .populate('products')
      .exec()
      .then((collections) => {
        cachedCollections = collections;
        return collections;
      });
  } else {
    return Q.fcall(() => cachedCollections);
  }
}

function mapOrder(customer, ecOrder) {
  debug('mapping %s order\'s', customer.email);

  let order;
  return EcDomain.Order.create(ecOrder)
    .then((dbOrder) => {
      order = dbOrder;
      debug('order for %s created with id %s', customer.email, order.id);
      return findCollections();
    })
    .then((collections) => {
      let colsFound = _.filter(collections, (col) => col.code === ecOrder.code || col.code === 'FC');

      if (_.isEmpty(colsFound)) {
        debug('old selected collections not found %s - season %s', customer.email, ecOrder.code);
        return [];
      }
      debug('mapping %s selected collections: ', customer.email, _.pluck(colsFound, 'code'));
      let products = _.flatten(_.map(colsFound, (col) => col.products));
      return mapProducts(customer, products, ecOrder.shirts);
    })
    .then((products) => {
      debug('%d products associated with order %s from %s', products.length, order.id, customer.id);
      if (_.isEmpty(products)) {
        return [];
      }
      return mapDetails(order, products, customer);
    })
    .then((details) => {
      order.details = details;
      return order.promiseSave();
    });
}

function mapCustomers(ecUser) {
  debug('migrating customer: %s', ecUser.email);
  let customer = null;
  let orders = [];
  return EcDomain.Customer.create(ecUser)
    .then((dbCustomer) => {
      customer = dbCustomer;
      debug('mapping customer %s addresses', customer.email);
      return mapAddress(ecUser.address);
    })
    .then((address) => {
      debug('mapping customer %s orders', customer.email);
      customer.addresses.push(address.id);
      let promisedOrders = _.map(ecUser.seasons, (seasonOrder) => {
        return mapOrder(customer, seasonOrder);
      });
      return Q.all(promisedOrders);
    })
    .then((dbOrders) => {
      orders = dbOrders;
      customer.orders = dbOrders;
      return customer.promiseSave();
    }, (error) => {
      debug('ec-api:migrate map customer error', error);
      throw error;
    });
}

function migrateCustomers() {
  // Mongoose Query
  return ECModels.User
    .find({})
    .exec()
    .then((users) => {
      let promisedCustomers = _.map(users, (user) => mapCustomers(user));

      return Q.allSettled(promisedCustomers)
        .then((results) => {
          results.forEach((result) => {
            if (result.state === "fulfilled") {
              let customer = result.value;
              debug('customer created for %s with subscription: %s', customer.email, customer.stripeSubscription);
            } else {
              debug('customer error', result.reason);
            }
          });
        });
    });
}

DB.connect(dbConnectionURL);
DB.connection
  .once('connected', () => {
    debug('DB connected to', dbConnectionURL);
    migrateCustomers()
      .then(() => process.exit(0));
  });
