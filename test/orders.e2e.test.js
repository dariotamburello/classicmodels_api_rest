/* eslint-disable no-undef */
import request from 'supertest'
import { expect as _expect } from 'chai'
import { app } from '../index.js'
const expect = _expect
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkYzdmMGJiLTcwNzktNDk3Zi05ZTJmLThkNDRiZWZjNGJkMyIsInVzZXJuYW1lIjoiZHRhbWJ1cmVsbG8iLCJpYXQiOjE3Mjc5ODkzNzcsImV4cCI6MTcyNzk5Mjk3N30.qNthUkJBuJUOoLoYkK-t8O0-BdJA1QrjHprZEYvVmWc'

describe('API orders', () => {
  let createdOrderId
  it('Get all the orders', async () => {
    const res = await request(app)
      .get('/orders')
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array')
  })

  it('Try to create a new order', async () => {
    const newOrder = {
      requiredDate: '2023-08-22T00:00:00.000Z',
      customerNumber: 505,
      total: 250.50,
      status: 'efc51ab9-656a-11ef-91c8-00ff57cc6be4',
      paymentCheckNumber: 'QY199948',
      pickUpOffice: '810add72-656f-11ef-91c8-00ff57cc6be4'
    }
    const res = await request(app)
      .post('/orders')
      .set('Cookie', `access_token=${token}`)
      .send(newOrder)
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.include(newOrder)
    createdOrderId = res.body.orderNumber
  })

  it('Get a specific order', async () => {
    const res = await request(app)
      .get(`/orders/${createdOrderId}`)
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body[0].orderNumber).to.equal(createdOrderId)
  })

  it('Update a specific order', async () => {
    const updateOrder = {
      total: 300.25
    }
    const res = await request(app)
      .patch(`/orders/${createdOrderId}`)
      .set('Cookie', `access_token=${token}`)
      .send(updateOrder)
    expect(res.status).to.equal(200)
    expect(res.body.total).to.equal(300.25)
  })

  it('Get a non existing order', async () => {
    const res = await request(app)
      .get('/orders/999999')
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array')
  })

  it('Delete a specific order', async () => {
    const res = await request(app)
      .delete(`/orders/${createdOrderId}`)
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('message', 'Order deleted.')
  })
})
