import { Router } from 'express'
import { MaintenanceController } from '../controllers/maintenance.js'
import { isAdmin, validateSession } from '../middleware/auth.js'

export const createMaintenanceRouter = () => {
  const maintenanceRouter = new Router()
  const maintenanceController = new MaintenanceController()

  // maintenanceRouter.get('/', [validateSession, isAdmin], orderController.getAll)
  maintenanceRouter.patch('/updatealldates', [validateSession, isAdmin], maintenanceController.updateAllDates)

  return maintenanceRouter
}
