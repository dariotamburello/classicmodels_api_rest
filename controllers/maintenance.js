import { defaultDataModel } from '../server-data-model.js'
import { DataError } from '../utils/errorTypes.js'

export class MaintenanceController {
  updateAllDates = async (req, res, next) => {
    try {
      const resultOrders = await defaultDataModel.OrderModel.updateAllDates(req.body)
      if (!resultOrders) throw new DataError('Orders update failed.')
      const resultPayments = await defaultDataModel.PaymentsModel.updateAllDates(req.body)
      if (!resultPayments) throw new DataError('Payments update failed.')
      res.json(`${resultOrders + resultPayments}`)
    } catch (error) {
      return next(error)
    }
  }
}
