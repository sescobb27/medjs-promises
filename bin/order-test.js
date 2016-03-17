/*global describe, expect, beforeEach, it */
'use strict';
/*
This Code is not intended to work, it was extracted from E&C internal product
to show Advance Promise examples.
 */

let _ = require('lodash');

describe('Order with details', function () {
  var orderDetailDefaults = {
    sku: 'FC-fey-11-6',
    orderType: 'subscription',
    quantity: 10,
    price: 4000,
    product: new Product().id
  };

  var orderDefault = {
    orderType: 'subscription',
    plan: '3-shirt'
  };

  var addressDefault = {
    addressType: 'shipping',
    line1: 'lin1',
    line2: 'line2',
    zip: '10038',
    city: 'Far Far Away',
    state: 'NY',
    country: 'CO',
    active: true
  };
  beforeEach(() => {
    return Address.create(addressDefault)
      .then((address) => {
        this.address = address;
        orderDefault.address = address._id;
        return Order.create(orderDefault);
      })
      .then((order) => {
        expect(order).to.have.property('boxStatus', 'empty');
        this.order = order;
        orderDetailDefaults.order = order;
        return OrderDetail.create(orderDetailDefaults);
      })
      .then((orderDetail) => {
        this.orderDetail = orderDetail;
        this.order.details.push(orderDetail);
        return this.order.promiseSave();
      });
  });

  describe('#getDetailPrices', () => {
    it('should return an array of details with prices', () => {
      return this.order.getDetailPrices().then((items) => {
        expect(items.length).to.equal(10);
        var total = _.reduce(_.pluck(items, 'price'), (total, price) => {
          return total + price;
        }, 0);
        expect(total).to.equal(40000);
      });
    });
  });

  describe('#getShippingAddressPrice', () => {
    it('should return order\'s shipping price', () => {
      return this.order.getShippingAddressPrice().then((price) => {
        expect(price).to.equal(2500);
      });
    });
  });

  describe('#getExtras', () => {
    it('should return order\'s extras', () => {
      return this.order.getExtras()
        .then((extras) => {
          // extras is 10 items - 3 items from 3-shirt plan + shipping price
          expect(extras.length).to.equal(8);
          var shippingPrice;
          var orderItems = _.filter(extras, (itemExtra) => {
            // itemExtra.detail !== 'shipping'
            if (itemExtra.detail === 'shipping') {
              shippingPrice = itemExtra.price;
              return false;
            }
            return true;
          });
          expect(orderItems.length).to.equal(7);
          var itemsSubtotal = _.reduce(_.pluck(orderItems, 'price'), (total, price) => {
            return total + price;
          }, 0);
          expect(itemsSubtotal).to.equal(28000);
          expect(shippingPrice).to.equal(2500);
        });
    });
  });

  describe('#getExtraCharges', () => {
    beforeEach(() => {
      return Address.create(addressDefault)
        .then((address) => {
          this.address = address;
          orderDefault.address = address._id;
          return Order.create(orderDefault);
        })
        .then((order) => {
          this.order = order;
          orderDetailDefaults.order = order;
          return OrderDetail.create(orderDetailDefaults);
        })
        .then((orderDetail) => {
          this.orderDetail = orderDetail;
          this.order.details.push(orderDetail);
          return this.order.promiseSave();
        });
    });

    it('should have extra charges (extras - shipping - coupon)', () => {
      this.order.coupon = 'TEST20';
      return this.order.getExtras()
        .then((extras) => {
          return this.order.getExtraCharges(extras);
        })
        .then((extraCharges) => {
          expect(extraCharges).have.property('total', 13200);
          expect(extraCharges).have.property('shipping_price', 2500);
          expect(extraCharges).have.property('stripe_discount', 3300);
          expect(extraCharges).have.property('remaining_items_price', 14000);
        });
    });

    it('should have extra charges (extras - coupon)', () => {
      this.address.country = 'US';
      return this.address.promiseSave()
        .then((address) => {
          this.order.coupon = 'TEST20';
          this.order.address = address;
          return this.order.promiseSave();
        })
        .then((order) => {
          this.order = order;
          return this.order.getExtras();
        })
        .then((extras) => {
          return this.order.getExtraCharges(extras);
        })
        .then((extraCharges) => {
          expect(extraCharges).have.property('total', 11200);
          expect(extraCharges).have.property('shipping_price', 0);
          expect(extraCharges).have.property('stripe_discount', 2800);
          expect(extraCharges).have.property('remaining_items_price', 14000);
        });
    });

    it('should have extra charges (extras)', () => {
      this.address.country = 'US';
      return this.address.promiseSave()
        .then((address) => {
          this.order.address = address;
          return this.order.promiseSave();
        })
        .then((order) => {
          this.order = order;
          return this.order.getExtras();
        })
        .then((extras) => {
          return this.order.getExtraCharges(extras);
        })
        .then((extraCharges) => {
          expect(extraCharges).have.property('total', 14000);
          expect(extraCharges).have.property('shipping_price', 0);
          expect(extraCharges).have.property('stripe_discount', 0);
          expect(extraCharges).have.property('remaining_items_price', 14000);
        });
    });

    it('should not have extra charges', () => {
      this.address.country = 'US';
      return this.address.promiseSave()
        .then((address) => {
          this.order.address = address;
        })
        .then(() => {
          this.orderDetail.quantity = 3;
          return this.orderDetail.promiseSave();
        })
        .then((orderDetail) => {
          this.order.details = [orderDetail];
        })
        .then(() => {
          return this.order.promiseSave();
        })
        .then((order) => {
          this.order = order;
          return this.order.getExtras();
        })
        .then((extras) => {
          return this.order.getExtraCharges(extras);
        })
        .then((extraCharges) => {
          expect(extraCharges).have.property('total', 0);
          expect(extraCharges).have.property('shipping_price', 0);
          expect(extraCharges).have.property('stripe_discount', 0);
          expect(extraCharges).have.property('remaining_items_price', 0);
        });
    });

    it('should only have shipping extra charge', () => {
      this.orderDetail.quantity = 3;
      return this.orderDetail.promiseSave()
        .then((orderDetail) => {
          this.order.details = [orderDetail];
          return this.order.promiseSave();
        })
        .then(() => {
          return this.order.getExtras();
        })
        .then((extras) => {
          return this.order.getExtraCharges(extras);
        })
        .then((extraCharges) => {
          expect(extraCharges).have.property('total', 2500);
          expect(extraCharges).have.property('shipping_price', 2500);
          expect(extraCharges).have.property('stripe_discount', 0);
          expect(extraCharges).have.property('remaining_items_price', 0);
        });
    });
  });
});
