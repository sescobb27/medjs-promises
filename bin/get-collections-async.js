'use strict';

let request = require('request');
let _ = require('lodash');
/*
  [{
    "type": "collections",
    "id": "56c4c6a3d800f2110034f330",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f330"
    },
    "attributes": {
      "code": "FA16",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/fa-collection-bg.jpg",
      "status": "inactive",
      "title": "Fall 2016",
      "season-start-date": "2016-04-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f330/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f326",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f326"
    },
    "attributes": {
      "code": "SP14",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/sp-collection-bg.jpg",
      "status": "inactive",
      "title": "Spring 2014",
      "season-start-date": "2014-11-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f339"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f333"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f340"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f326/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f327",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f327"
    },
    "attributes": {
      "code": "WN14",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/wn-collection-bg.jpg",
      "status": "inactive",
      "title": "Winter 2014",
      "season-start-date": "2014-08-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f34c"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f346"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f33a"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f327/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f328",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f328"
    },
    "attributes": {
      "code": "FA14",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/fa-collection-bg.jpg",
      "status": "inactive",
      "title": "Fall 2014",
      "season-start-date": "2014-04-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f334"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f341"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f34d"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f328/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f329",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f329"
    },
    "attributes": {
      "code": "SM14",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/sm-collection-bg.jpg",
      "status": "inactive",
      "title": "Summer 2014",
      "season-start-date": "2014-02-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f347"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f33b"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f335"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f329/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f32a",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f32a"
    },
    "attributes": {
      "code": "SP15",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/sp-collection-bg.jpg",
      "status": "inactive",
      "title": "Spring 2015",
      "season-start-date": "2015-11-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f342"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f34e"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f348"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f32a/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f32b",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f32b"
    },
    "attributes": {
      "code": "WN15",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/wn-collection-bg.jpg",
      "status": "inactive",
      "title": "Winter 2015",
      "season-start-date": "2015-08-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f33c"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f336"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f343"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f32b/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f32c",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f32c"
    },
    "attributes": {
      "code": "FA15",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/fa-collection-bg.jpg",
      "status": "inactive",
      "title": "Fall 2015",
      "season-start-date": "2015-04-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f34f"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f349"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f33d"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f32c/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f32d",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f32d"
    },
    "attributes": {
      "code": "SM15",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/sm-collection-bg.jpg",
      "status": "inactive",
      "title": "Summer 2015",
      "season-start-date": "2015-02-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f337"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f344"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f350"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f32d/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f32e",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f32e"
    },
    "attributes": {
      "code": "SP16",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/sp-collection-bg.jpg",
      "status": "active",
      "title": "Spring 2016",
      "season-start-date": "2016-11-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f34a"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f33e"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f338"
        }, {
          "type": "products",
          "id": "56c4fa7a236e360300b462cc"
        }, {
          "type": "products",
          "id": "56c5f534d6778a03001c099b"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f32e/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f325",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f325"
    },
    "attributes": {
      "code": "FC",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/fc-collection-bg.jpg",
      "status": "active",
      "title": "Forever",
      "season-start-date": "2011-02-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c4c6a3d800f2110034f332"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f33f"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f34b"
        }, {
          "type": "products",
          "id": "56c4c6a3d800f2110034f345"
        }, {
          "type": "products",
          "id": "56c5eff0d6778a03001c099a"
        }, {
          "type": "products",
          "id": "56c5f69bd6778a03001c099c"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f325/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f32f",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f32f"
    },
    "attributes": {
      "code": "WN16",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/wn-collection-bg.jpg",
      "status": "inactive",
      "title": "Winter 2016",
      "season-start-date": "2016-08-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c5f6e7d6778a03001c099d"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f32f/relationships/products"
        }
      }
    }
  }, {
    "type": "collections",
    "id": "56c4c6a3d800f2110034f331",
    "links": {
      "self": "/collections/56c4c6a3d800f2110034f331"
    },
    "attributes": {
      "code": "SM16",
      "image": "https://ec-staging.s3.amazonaws.com/assets/dev-images/sm-collection-bg.jpg",
      "status": "inactive",
      "title": "Summer 2016",
      "season-start-date": "2016-02-01T00:00:00.000Z"
    },
    "relationships": {
      "products": {
        "data": [{
          "type": "products",
          "id": "56c6160b36332b0300bfa76f"
        }],
        "links": {
          "self": "/collections/56c4c6a3d800f2110034f331/relationships/products"
        }
      }
    }
  }]
*/
request('https://ec-api-staging.herokuapp.com/collections', (err, res, body) => {
  let collections = JSON.parse(body).data;
  let names = collections.map((col) => col.attributes.title);
  console.log('Names: ', names);
  let products = _.flatMap(collections, (col) => col.relationships.products.data);
  let productIds = products.map((product) => product.id);
  return getProducts(productIds);
});

let resolvedProducts = [];

function getProducts(products) {
  if (products.length === 0) {
    console.log('# of products: ', resolvedProducts.length);
    return resolvedProducts;
  }
  let product = products[0];

  request.get(`https://ec-api-staging.herokuapp.com/products/${product}`, (err, res, body) => {
    let product = JSON.parse(body).data;
    console.log('Product Name is: ', product.attributes.title);
    resolvedProducts.push(product);
    products.shift();
    getProducts(products);
  });
}
