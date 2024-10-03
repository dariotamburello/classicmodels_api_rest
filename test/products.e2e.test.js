/* eslint-disable no-undef */
import request from 'supertest'
import { expect as _expect } from 'chai'
import { app } from '../index.js'
const expect = _expect
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZkYzdmMGJiLTcwNzktNDk3Zi05ZTJmLThkNDRiZWZjNGJkMyIsInVzZXJuYW1lIjoiZHRhbWJ1cmVsbG8iLCJpYXQiOjE3Mjc5ODkzNzcsImV4cCI6MTcyNzk5Mjk3N30.qNthUkJBuJUOoLoYkK-t8O0-BdJA1QrjHprZEYvVmWc'

describe('API product', () => {
  let createdProductId
  it('Get all the product', async () => {
    const res = await request(app)
      .get('/products')
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array')
  })

  it('Try to create a new product', async () => {
    const newProduct = {
      productCode: 'S99_9999',
      productName: 'Shun Armadura Andromeda Divina',
      productLine: '2b1bb0e1-6548-11ef-91c8-00ff57cc6be4',
      productScale: '1:50',
      productVendor: 'Bandai Company',
      productImage: 'http://image.jpg',
      productDescription: 'Figura de Shun armadura Divina de Andromeda linea mith Exclamation',
      quantityInStock: 100,
      buyPrice: 88.00,
      MSRP: 110.10
    }
    const res = await request(app)
      .post('/products')
      .set('Cookie', `access_token=${token}`)
      .send(newProduct)
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(res.body).to.include(newProduct)
    createdProductId = res.body.id
  })

  it('Get a specific product', async () => {
    const res = await request(app)
      .get(`/products/${createdProductId}`)
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body[0].id).to.equal(createdProductId)
  })

  it('Update a specific product', async () => {
    const updateOrder = {
      productName: 'Armadura dorada Virgo'
    }
    const res = await request(app)
      .patch(`/products/${createdProductId}`)
      .set('Cookie', `access_token=${token}`)
      .send(updateOrder)
    expect(res.status).to.equal(200)
    expect(res.body.productName).to.equal('Armadura dorada Virgo')
  })

  it('Get a non existing product', async () => {
    const res = await request(app)
      .get('/products/999999')
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('array')
  })

  it('Delete a specific product', async () => {
    const res = await request(app)
      .delete(`/products/${createdProductId}`)
      .set('Cookie', `access_token=${token}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('message', 'Product deleted.')
  })
})
