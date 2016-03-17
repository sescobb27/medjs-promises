'use strict';
/*
This Code is not intended to work, it was extracted from E&C internal product
to show Advance Promise examples.
 */
let promiseNumber = new Promise((resolve, reject) => {
  resolve(5);
});

let promiseString = new Promise((resolve, reject) => {
  resolve("Hello World");
});

promiseNumber
  .then((number) => {
    console.log(number);
    return promiseString;
  })
  .then((str) => {
    console.log(str);
  });


let promiseError = new Promise((resolve, reject) => {
  reject(new Error("Validation Error"));
});

promiseNumber
  .then((number) => {
    console.log(number);
    return promiseError;
  })
  .then(() => {
    return promiseString;
  })
  .then((str) => {
    console.log(str);
  })
  .catch((error) => {
    console.error(error);
  });

Promise.all([
    promiseNumber,
    promiseString
  ])
  .then((result) => {
    console.log('promiseNumber: ', result[0]);
    console.log('promiseString: ', result[1]);
  });
