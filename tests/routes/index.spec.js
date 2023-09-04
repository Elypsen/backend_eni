const express = require('express')
const app = require('../../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaJquery = require('chai-jquery')
const expect = chai.expect

chai.use(chaiHttp)
chai.use(chaJquery)

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.text).contain('Express Brains')
        done()
      })
  })
  it('should contains form to try a number', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.text).contain('Express Brains')
        done()
      })
  })
})
