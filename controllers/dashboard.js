import { CustomersDictionary, OfficesDictionary, OrdersDictionary, OrderStatusDictionary, PaymentMethodsDictionary, PaymentsDictionary, PaymentStatusDictionary, ProductLinesDictionary, ProductsDictionary, UsersDictionary } from '../constants/modelsDictionary.js'
import { options } from '../constants/pdfOptions.js'
import { handlePagination } from '../middleware/pagination.js'
import { CustomerModel } from '../models/customers.js'
import { OfficeModel } from '../models/offices.js'
import { OrderDetailsModel } from '../models/orderDetails.js'
import { OrderModel } from '../models/orders.js'
import { OrderStatusModel } from '../models/orderStatus.js'
import { PaymentMethodsModel } from '../models/paymentMethods.js'
import { PaymentsModel } from '../models/payments.js'
import { PaymentStatusModel } from '../models/paymentStatus.js'
import { ProductLineModel } from '../models/productLines.js'
import { ProductModel } from '../models/products.js'
import { UsersModel } from '../models/users.js'
import { AppError } from '../utils/errorTypes.js'

// const pdf = require('pdf-creator-node')
// const fs = require('fs')
// const path = require('path')

import { fileURLToPath } from 'url'
import pdf from 'pdf-creator-node'
import fs from 'fs'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)

export class DashboardController {
  dashboard = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      const orders = await OrderModel.getAll('')

      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      const disputedCode = 'efc52875-656a-11ef-91c8-00ff57cc6be4'
      const orderCreatedCode = 'efc52444-656a-11ef-91c8-00ff57cc6be4'
      const { totalAmount, orderCount, noPickUpDateCount, disputedOrders } = orders.reduce((accumulator, order) => {
        const orderYear = new Date(order.orderDate).getFullYear()
        const orderMonth = new Date(order.orderDate).getMonth()
        if (orderYear === currentYear && currentMonth === orderMonth) {
          accumulator.totalAmount += parseFloat(order.total)
          accumulator.orderCount += 1
        }
        if (order.status !== orderCreatedCode) accumulator.noPickUpDateCount += 1
        if (order.status === disputedCode) accumulator.disputedOrders += 1

        return accumulator
      }, { totalAmount: 0, orderCount: 0, noPickUpDateCount: 0, disputedOrders: 0 })

      const ordersComplete = await OrderModel.getAllComplete('')
      const latestOrders = ordersComplete
        .sort((a, b) => b.orderNumber - a.orderNumber)
        .slice(0, 10)
      const ordersDisplayInTable = latestOrders.map(({ orderNumber, orderDate, pickUpDate, paymentCheckNumber, pickUpOffice, comments, requiredDate, type, ...rest }) => ({
        orderDate: formatDate(orderDate),
        ...rest
      }))

      const orderDetails = await OrderDetailsModel.getAllComplete('')
      const topSellingProducts = Object.values(
        orderDetails.reduce((acc, orderDetail) => {
          const { productId, productName, productImage, quantityOrdered, buyPrice } = orderDetail

          if (!acc[productId]) {
            acc[productId] = {
              productId,
              productName,
              productImage,
              totalSold: 0
            }
          }

          acc[productId].totalSold += quantityOrdered * parseFloat(buyPrice)

          return acc
        }, {})
      )
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5)

      const topSellingProductsDisplayInTable = topSellingProducts.map(({ productId, productImage, productName, totalSold, ...rest }) => ({
        image: productImage,
        productName,
        totalSold: formatPrice(totalSold),
        ...rest
      }))

      res.render('dashboard', {
        data: {
          username,
          totalAmount: formatPrice(totalAmount),
          orderCount,
          noPickUpDateCount,
          disputedOrders,
          lastOrdersTitles: OrdersDictionary.smallTableTitles,
          lastOrdersRows: ordersDisplayInTable,
          topSellingProducts: topSellingProductsDisplayInTable
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.productsView.name}`))
    }
  }

  productsView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let productsComplete = await ProductModel.getAllComplete()
      productsComplete.sort((a, b) => b.id - a.id)

      if (req.query.search) {
        const valueToSearch = req.query.search
        productsComplete = productsComplete.filter((product) => {
          return (
            product.productCode.toLowerCase().includes(valueToSearch.toLowerCase()) ||
            product.productName.toLowerCase().includes(valueToSearch.toLowerCase()) ||
            product.productDescription.toLowerCase().includes(valueToSearch.toLowerCase())
          )
        })
      }

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(productsComplete, req.query.page, 10)
      productsComplete = dataPaged

      const productsDisplayInTable = productsComplete.map(({ ...rest }) => ({
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: ProductsDictionary,
          dataInTable: {
            tableRows: productsDisplayInTable
          },
          searcher: true,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          },
          pdfReport: true
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.productsView.name}`))
    }
  }

  orderlistView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let ordersComplete = await OrderModel.getAllComplete('')
      ordersComplete.sort((a, b) => b.orderNumber - a.orderNumber)

      if (req.query.search) {
        const valueToSearch = req.query.search
        ordersComplete = ordersComplete.filter((order) => {
          return (
            order.orderNumber === parseInt(valueToSearch) ||
            order.comments?.toLowerCase().includes(valueToSearch.toLowerCase()) ||
            order.customerName.toLowerCase().includes(valueToSearch.toLowerCase())
          )
        })
      }

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(ordersComplete, req.query.page, 10)
      ordersComplete = dataPaged

      const ordersDisplayInTable = ordersComplete.map(({ orderNumber, pickUpDate, paymentCheckNumber, pickUpOffice, orderDate, requiredDate, ...rest }) => ({
        id: orderNumber,
        orderNumber,
        orderDate: formatDate(orderDate),
        requiredDate: formatDate(requiredDate),
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: OrdersDictionary,
          dataInTable: {
            tableRows: ordersDisplayInTable
          },
          searcher: true,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.orderlistView.name}.`))
    }
  }

  paymentsView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let payments = await PaymentsModel.getAllComplete()
      payments.sort((a, b) => b.paymentDate - a.paymentDate)

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(payments, req.query.page, 10)
      payments = dataPaged

      const dataDisplayInTable = payments.map(({ checkNumber, paymentDate, ...rest }) => ({
        id: checkNumber,
        checkNumber,
        paymentDate: formatDate(paymentDate),
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: PaymentsDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: false,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  customersView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let customers = await CustomerModel.getAll('')
      customers.sort((a, b) => b.customerNumber - a.customerNumber)

      if (req.query.search) {
        const valueToSearch = req.query.search
        customers = customers.filter((customer) => {
          return (
            customer.customerNumber === parseInt(valueToSearch) ||
            customer.customerName.toLowerCase().includes(valueToSearch.toLowerCase()) ||
            customer.addressLine1.toLowerCase().includes(valueToSearch.toLowerCase()) ||
            customer.country.toLowerCase().includes(valueToSearch.toLowerCase())
          )
        })
      }

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(customers, req.query.page, 10)
      customers = dataPaged

      const dataDisplayInTable = customers.map(({ customerNumber, contactLastName, contactFirstName, phone, addressLine2, state, postalCode, salesRepEmployeeNumber, creditLimit, ...rest }) => ({
        id: customerNumber,
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: CustomersDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: true,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          },
          pdfReport: true
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  settingsView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      res.render('settings', {
        data: {
          username
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  officesView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let offices = await OfficeModel.getAll()
      offices.sort((a, b) => b.paymentDate - a.paymentDate)

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(offices, req.query.page, 10)
      offices = dataPaged

      const dataDisplayInTable = offices.map(({ id, phone, addressLine2, state, postalCode, territory, ...rest }) => ({
        id,
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: OfficesDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: false,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  paymentMethodsView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let paymentMethods = await PaymentMethodsModel.getAll()
      paymentMethods.sort((a, b) => a.id - b.id)

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(paymentMethods, req.query.page, 10)
      paymentMethods = dataPaged

      const dataDisplayInTable = paymentMethods.map(({ ...rest }) => ({
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: PaymentMethodsDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: false,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  paymentStatusView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let paymentStatus = await PaymentStatusModel.getAll()
      paymentStatus.sort((a, b) => a.id - b.id)

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(paymentStatus, req.query.page, 10)
      paymentStatus = dataPaged

      const dataDisplayInTable = paymentStatus.map(({ ...rest }) => ({
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: PaymentStatusDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: false,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  orderStatusView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let orderStatus = await OrderStatusModel.getAll()
      orderStatus.sort((a, b) => a.id - b.id)

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(orderStatus, req.query.page, 10)
      orderStatus = dataPaged

      const dataDisplayInTable = orderStatus.map(({ ...rest }) => ({
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: OrderStatusDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: false,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  productLinesView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let productLines = await ProductLineModel.getAll()
      productLines.sort((a, b) => a.id - b.id)

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(productLines, req.query.page, 10)
      productLines = dataPaged

      const dataDisplayInTable = productLines.map(({ ...rest }) => ({
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: ProductLinesDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: false,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  usersView = async (req, res, next) => {
    try {
      const { user } = req.session
      const username = user.username

      let users = await UsersModel.getAll()
      users.sort((a, b) => a.id - b.id)

      const { dataPaged, nextPage, prevPage, currentPage } = pagination(users, req.query.page, 10)
      users = dataPaged

      const dataDisplayInTable = users.map(({ password, username, registerAt, lastLogin, active, ...rest }) => ({
        username,
        registerAt: formatDate(registerAt),
        lastLogin: formatDate(lastLogin),
        active,
        ...rest
      }))

      res.render('template-CRUD', {
        data: {
          username,
          dictionary: UsersDictionary,
          dataInTable: {
            tableRows: dataDisplayInTable
          },
          searcher: false,
          pagination: {
            prevPage,
            nextPage,
            currentPage
          }
        }
      }, (err, html) => {
        if (err) throw new Error(err)
        res.send(html)
      })
    } catch (error) {
      next(new AppError(error, `[${this.constructor.name}] ${this.paymentsView.name}.`))
    }
  }

  generatePdf = async (req, res, next) => {
    try {
      console.time()
      const __dirname = path.dirname(__filename)
      const html = fs.readFileSync(path.join(__dirname, '../views/template-pdf.html'), 'utf-8')
      console.timeEnd()
      const filename = Math.random().toString().substring(2) + '_doc' + '.pdf'
      let document

      return res.json('part1')

      console.time()
      if (req.query.entity === 'products') {
        const products = await ProductModel.getAllComplete('')
        const productsInTable = products.sort((a, b) => b.id - a.id).map(({ id, ...rest }) => ({
          ...rest
        }))
        document = {
          html,
          data: {
            titles: ProductsDictionary.tableTitles,
            entity: productsInTable
          },
          path: './docs/' + filename
        }
      } else if (req.query.entity === 'customers') {
        const customers = await CustomerModel.getAll('')
        const customersInTable = customers.sort((a, b) => b.id - a.id).map(({ customerNumber, contactLastName, contactFirstName, phone, addressLine2, state, postalCode, salesRepEmployeeNumber, creditLimit, ...rest }) => ({
          ...rest
        }))
        document = {
          html,
          data: {
            titles: CustomersDictionary.tableTitles,
            entity: customersInTable
          },
          path: './docs/' + filename
        }
      }
      console.timeEnd()
      console.time()
      const pdfFile = await pdf.create(document, options)
      if (pdfFile) {
        const filepath = '/docs/' + filename
        res.json({ filepath })
      } else {
        res.status(404)
      }
      console.timeEnd()
    } catch (error) {
      return next(error)
    }
  }
}

const pagination = (dataSet, page, limit) => {
  if (page) {
    const results = handlePagination(dataSet, page, limit)
    const dataPaged = results.result
    const nextPage = results.next?.page
    const prevPage = results.previous?.page
    const currentPage = results.current?.page
    return { dataPaged, nextPage, prevPage, currentPage }
  } else {
    return { dataPaged: dataSet }
  }
}

function formatDate (date) {
  if (!date) return null
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date(date)).replace(',', '')
}

function formatPrice (value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
