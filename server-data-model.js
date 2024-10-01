// import { ProductModel as ProductMysql } from './models/mysql/products.js'
// import { ProductModel as ProductMongo } from './models/mongodb/products.js'
// import { ProductLineModel as ProductLineMysql } from './models/mysql/productLines.js'
// import { ProductLineModel as ProductLineMongo } from './models/mongodb/productLines.js'
// import { CustomerModel as CustomerMysql } from './models/mysql/customers.js'
// import { CustomerModel as CustomerMongo } from './models/mongodb/customers.js'
// import { OfficeModel as OfficeMysql } from './models/mysql/offices.js'
// import { OfficeModel as OfficeMongo } from './models/mongodb/offices.js'
// import { EmployeeModel as EmployeeMysql } from './models/mysql/employees.js'
// import { EmployeeModel as EmployeeMongo } from './models/mongodb/employees.js'
// import { OrderModel as OrderMysql } from './models/mysql/orders.js'
// import { OrderModel as OrderMongo } from './models/mongodb/orders.js'
// import { OrderStatusModel as OrderStatusMysql } from './models/mysql/orderStatus.js'
// import { OrderStatusModel as OrderStatusMongo } from './models/mongodb/orderStatus.js'
// import { OrderDetailsModel as OrderDetailsMysql } from './models/mysql/orderDetails.js'
// import { OrderDetailsModel as OrderDetailsMongo } from './models/mongodb/orderDetails.js'
// import { PaymentMethodsModel as PaymentMethodsMysql } from './models/mysql/paymentMethods.js'
// import { PaymentMethodsModel as PaymentMethodsMongo } from './models/mongodb/paymentMethods.js'
// import { PaymentsModel as PaymentsMysql } from './models/mysql/payments.js'
// import { PaymentsModel as PaymentsMongo } from './models/mongodb/payments.js'
// import { UsersModel as UsersMysql } from './models/mysql/users.js'
// import { UsersModel as UsersMongo } from './models/mongodb/users.js'
// import { PaymentStatusModel as PaymentStatusMysql } from './models/mysql/paymentStatus.js'
// import { PaymentStatusModel as PaymentStatusMongo } from './models/mongodb/paymentStatus.js'
// import { LogsModel as LogsMysql } from './models/mysql/logs.js'
// import { LogsModel as LogsMongo } from './models/mongodb/logs.js'

// const mongoDataModels = {
//   ProductModel: ProductMongo,
//   ProductLineModel: ProductLineMongo,
//   CustomerModel: CustomerMongo,
//   OfficeModel: OfficeMongo,
//   EmployeeModel: EmployeeMongo,
//   OrderModel: OrderMongo,
//   OrderStatusModel: OrderStatusMongo,
//   OrderDetailsModel: OrderDetailsMongo,
//   PaymentMethodsModel: PaymentMethodsMongo,
//   PaymentsModel: PaymentsMongo,
//   UsersModel: UsersMongo,
//   PaymentStatusModel: PaymentStatusMongo,
//   LogsModel: LogsMongo
// }

// const mysqlDataModels = {
//   ProductModel: ProductMysql,
//   ProductLineModel: ProductLineMysql,
//   CustomerModel: CustomerMysql,
//   OfficeModel: OfficeMysql,
//   EmployeeModel: EmployeeMysql,
//   OrderModel: OrderMysql,
//   OrderStatusModel: OrderStatusMysql,
//   OrderDetailsModel: OrderDetailsMysql,
//   PaymentMethodsModel: PaymentMethodsMysql,
//   PaymentsModel: PaymentsMysql,
//   UsersModel: UsersMysql,
//   PaymentStatusModel: PaymentStatusMysql,
//   LogsModel: LogsMysql
// }

let dataModel
if (process.env.ENV !== 'PRD') process.loadEnvFile()
if (process.env.MODEL === 'MONGO') {
  const { ProductModel } = await import('./models/mongodb/products.js')
  const { ProductLineModel } = await import('./models/mongodb/productLines.js')
  const { CustomerModel } = await import('./models/mongodb/customers.js')
  const { OfficeModel } = await import('./models/mongodb/offices.js')
  const { EmployeeModel } = await import('./models/mongodb/employees.js')
  const { OrderModel } = await import('./models/mongodb/orders.js')
  const { OrderStatusModel } = await import('./models/mongodb/orderStatus.js')
  const { OrderDetailsModel } = await import('./models/mongodb/orderDetails.js')
  const { PaymentMethodsModel } = await import('./models/mongodb/paymentMethods.js')
  const { PaymentsModel } = await import('./models/mongodb/payments.js')
  const { UsersModel } = await import('./models/mongodb/users.js')
  const { PaymentStatusModel } = await import('./models/mongodb/paymentStatus.js')
  const { LogsModel } = await import('./models/mongodb/logs.js')

  dataModel = {
    ProductModel,
    ProductLineModel,
    CustomerModel,
    OfficeModel,
    EmployeeModel,
    OrderModel,
    OrderStatusModel,
    OrderDetailsModel,
    PaymentMethodsModel,
    PaymentsModel,
    UsersModel,
    PaymentStatusModel,
    LogsModel
  }
} else if (process.env.MODEL === 'MYSQL') {
  const { ProductModel } = await import('./models/mysql/products.js')
  const { ProductLineModel } = await import('./models/mysql/productLines.js')
  const { CustomerModel } = await import('./models/mysql/customers.js')
  const { OfficeModel } = await import('./models/mysql/offices.js')
  const { EmployeeModel } = await import('./models/mysql/employees.js')
  const { OrderModel } = await import('./models/mysql/orders.js')
  const { OrderStatusModel } = await import('./models/mysql/orderStatus.js')
  const { OrderDetailsModel } = await import('./models/mysql/orderDetails.js')
  const { PaymentMethodsModel } = await import('./models/mysql/paymentMethods.js')
  const { PaymentsModel } = await import('./models/mysql/payments.js')
  const { UsersModel } = await import('./models/mysql/users.js')
  const { PaymentStatusModel } = await import('./models/mysql/paymentStatus.js')
  const { LogsModel } = await import('./models/mysql/logs.js')

  dataModel = {
    ProductModel,
    ProductLineModel,
    CustomerModel,
    OfficeModel,
    EmployeeModel,
    OrderModel,
    OrderStatusModel,
    OrderDetailsModel,
    PaymentMethodsModel,
    PaymentsModel,
    UsersModel,
    PaymentStatusModel,
    LogsModel
  }
}

if (process.env.ENV !== 'PRD') process.loadEnvFile()
export let defaultDataModel
if (process.env.MODEL === 'MONGO') defaultDataModel = { ...dataModel }
if (process.env.MODEL === 'MYSQL') defaultDataModel = { ...dataModel }
