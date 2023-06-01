/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'New Book'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.property(res.body, 'title', 'Book in object should contain title');
            assert.property(res.body, '_id', 'Book in object should contain _id');
            assert.equal(res.body.title, 'New Book', 'Response title should match')
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be an string');
            assert.equal(res.body, 'missing required field title', 'Response should match the error message');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/647877777799f575165163aa')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'response should be an string');
            assert.equal(res.body, 'no book exists', 'Response should match with error message')
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/6478c350d799f575165163aa')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book in object should contain title');
            assert.property(res.body, '_id', 'Book in object should contain _id');
            assert.property(res.body, 'comments', 'Book in object should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/6478c350d799f575165163aa')
          .send({
            comment: "It is an amazing book"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book in object should contain title');
            assert.property(res.body, '_id', 'Book in object should contain _id');
            assert.property(res.body, 'comments', 'Book in object should contain comments');
            assert.isArray(res.body.comments, 'comments should be an array');
            done();
          });

      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/6478c350d799f575165163aa')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be an string');
            assert.equal(res.body, 'missing required field comment', 'Response should match the error message');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/6478c350d799f575188888oa')
          .send({
            comment: "I enjoyed alot when I was reading this book"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be an string');
            assert.equal(res.body, 'no book exists', 'Response should match the error message');
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/6478cd0b380b1e3c70318901')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be an string');
            assert.equal(res.body, 'delete successful', 'Response should match the succes message');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/6478cd00000b1e3c70318901')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body, 'Response should be an string');
            assert.equal(res.body, 'no book exists', 'Response should match the error message');
            done();
          });
      });

    });

  });

});
