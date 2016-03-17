'use strict';
/*
This Code is not intended to work, it was extracted from E&C internal product
to show Advance Promise examples.
 */

let _ = require('lodash');
let mongoose = require('mongoose');
let Q = require('q');

let Schema = mongoose.Schema;

let orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
  },
  details: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderDetail'
  }]
});

orderSchema.methods.getDetailPrices = function () {
  return new Promise((resolve, reject) => {
    this.populate('details', function (error, order) {
      if (error) {
        return reject(error);
      }
      let items = [];
      order.details.forEach(function (detail) {
        _.times(detail.quantity, function () {
          items.push({
            detail: detail.sku,
            price: detail.price
          });
        });
      });
      return resolve(items);
    });
  });
};

orderSchema.methods.getShippingAddressPrice = function () {
  return new Promise((resolve, reject) => {
    this.populate('address', function (error, order) {
      if (error) {
        return reject(error);
      }

      let address = order.address;
      // in tests we mock addresses so, they are null, that's we need this
      // validation here
      if (_.isEmpty(address)) {
        return resolve(0);
      }

      let shippingPrice;
      switch (address.country) {
      case 'US':
        shippingPrice = 0;
        break;
      case 'CA':
      case 'MX':
        shippingPrice = 1500;
        break;
      default:
        shippingPrice = 2500;
        break;
      }
      resolve(shippingPrice);
    });
  });
};

// extras is 10 items - 3 items from 3-shirt plan + shipping price
orderSchema.methods.getExtras = function () {
  return Q.all([
    this.getDetailPrices(),
    this.getShippingAddressPrice()
  ])
    .then((promises) => {
      let items = promises[0];
      // the first N items given plan's item limit are already charged and are not extras
      let itemLimit = _.find(plans, (plan) => {
        return plan.id === this.plan;
      }.bind(this)).itemLimit;

      items = _.drop(items, itemLimit);
      let shippingPrice = promises[1];
      if (shippingPrice !== 0) {
        items.push({
          detail: 'shipping',
          price: shippingPrice
        });
      }
      return items;
    });
};

orderSchema.methods.chargeExtras = function () {
  return this.getExtras()
    .then((extras) => {
      if (!_.isEmpty(extras)) {
        return this.getExtraCharges(extras);
      }
    })
    .then((extraCharges) => {
      if (extraCharges && extraCharges.total > 0) {
        // order's customer must be populated
        return this.customer.chargeExtras(this, extraCharges);
      }
    })
    .then(() => {
      this.changeBoxStatus();
    })
    .then(() => this);
};
