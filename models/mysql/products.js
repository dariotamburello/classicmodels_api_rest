import mysql from 'mysql2/promise'
import { msyqlConfiguration } from '../../configuration/dbConnections.js'
import { DBError } from '../../utils/errorTypes.js'

const connection = await mysql.createConnection(msyqlConfiguration)

export class ProductModel {
  static async getAll ({ productLine }) {
    try {
      const [products] = await connection.query(
        'SELECT * FROM products;'
      )
      if (products.length === 0) return []
      if (productLine) return products.filter(e => (e.productLine === productLine))
      return products
    } catch (error) {
      throw new DBError(error, 'Error getting products.')
    }
  }

  static async getById ({ id }) {
    try {
      const product = await connection.query(
        'SELECT * FROM products WHERE id = ?;',
        [id]
      )
      if (!product) return []
      return product[0]
    } catch (error) {
      throw new DBError(error, 'Error getting product.')
    }
  }

  static async getByCode ({ code }) {
    try {
      const product = await connection.query(
        'SELECT * FROM products WHERE productCode = ?;',
        [code]
      )
      if (!product) return []
      return product[0]
    } catch (error) {
      throw new DBError(error, 'Error getting product.')
    }
  }

  static async create (input) {
    try {
      const {
        id,
        productCode,
        productName,
        productLine,
        productScale,
        productVendor,
        productDescription,
        quantityInStock,
        buyPrice,
        MSRP,
        productImage
      } = input

      const existProduct = await this.getById({ id })
      if (existProduct.length > 0) return false

      await connection.query(
        `INSERT INTO products (id,
            productCode,
            productName,
            productLine,
            productScale,
            productVendor,
            productDescription,
            quantityInStock,
            buyPrice,
            MSRP,
            productImage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [id,
          productCode,
          productName,
          productLine,
          productScale,
          productVendor,
          productDescription,
          quantityInStock,
          buyPrice,
          MSRP,
          productImage]
      )

      return input
    } catch (error) {
      throw new DBError(error, 'Error creating product.')
    }
  }

  static async delete (id) {
    try {
      const result = await connection.query(
        'DELETE FROM products WHERE id = ?;',
        [id]
      )
      if (result[0].affectedRows === 0) return false
      return true
    } catch (error) {
      throw new DBError(error, 'Error deleting product.')
    }
  }

  static async update (id, input) {
    try {
      const existProduct = await this.getById({ id })
      if (existProduct.length === 0) return false

      const productComplete = {
        productCode: input.productCode ?? existProduct[0].productCode,
        productName: input.productName ?? existProduct[0].productName,
        productLine: input.productLine ?? existProduct[0].productLine,
        productScale: input.productScale ?? existProduct[0].productScale,
        productVendor: input.productVendor ?? existProduct[0].productVendor,
        productDescription: input.productDescription ?? existProduct[0].productDescription,
        quantityInStock: input.quantityInStock ?? existProduct[0].quantityInStock,
        buyPrice: input.buyPrice ?? existProduct[0].buyPrice,
        MSRP: input.MSRP ?? existProduct[0].MSRP,
        productImage: input.productImage ?? existProduct[0].productImage
      }

      await connection.query(
        `UPDATE products 
        SET productCode = ?, productName = ?, productLine = ?, productScale = ?,
            productVendor = ?, productDescription = ?, quantityInStock = ?, buyPrice = ?,
            MSRP = ?, productImage = ?
        WHERE id = '${id}';`,
        [
          productComplete.productCode, productComplete.productName, productComplete.productLine,
          productComplete.productScale, productComplete.productVendor, productComplete.productDescription,
          productComplete.quantityInStock, productComplete.buyPrice, productComplete.MSRP, productComplete.productImage
        ]
      )

      return productComplete
    } catch (error) {
      throw new DBError(error, 'Error updating product.')
    }
  }

  static async getAllComplete () {
    try {
      const [products] = await connection.query(
        `SELECT 
        p.id,
        p.productCode,
        p.productName,
        p.productDescription,
        pl.title,
        p.buyPrice
        FROM products p
        JOIN productlines pl ON p.productLine = pl.id;`
      )
      if (products.length === 0) return []
      return products
    } catch (error) {
      throw new DBError(error, 'Error getting products.')
    }
  }
}
