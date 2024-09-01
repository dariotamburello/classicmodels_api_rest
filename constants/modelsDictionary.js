export const ProductsDictionary = {
  entityName: 'Products',
  stringURL: 'products',
  tableTitles: ['Code', 'Name', 'Description', 'Product Line', 'Price'],
  modelForm: [
    { field: 'id', title: 'ID', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'productCode', title: 'Product code', input: 'input', type: 'text', create: true, editable: false, required: true },
    { field: 'productName', title: 'Name', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'productLine', title: 'Line', input: 'select', type: 'text', create: true, editable: true, required: true },
    { field: 'productScale', title: 'Scale', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'productVendor', title: 'Vendor', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'quantityInStock', title: 'Quantity in stock', input: 'input', create: true, type: 'number', editable: true, required: true },
    { field: 'buyPrice', title: 'Buy price', input: 'input', type: 'number', create: true, editable: true, step: 0.01, required: true },
    { field: 'MSRP', title: 'MSRP', input: 'input', type: 'number', create: true, editable: true, required: true },
    { field: 'productImage', title: 'Image Url', input: 'input', type: 'text', create: true, editable: true, required: true, image: true },
    { field: 'productDescription', title: 'Description', input: 'textarea', create: true, type: 'text', editable: true, required: true }
  ]
}

export const OrdersDictionary = {
  entityName: 'Orders',
  stringURL: 'orders',
  tableTitles: ['Order', 'Date', 'Required', 'Comments', 'Customer', 'Total', 'Status', 'Payment'],
  smallTableTitles: ['Date', 'Customer', 'Total', 'Status'],
  modelForm: [
    { field: 'orderNumber', title: 'Order number', input: 'input', type: 'number', create: false, editable: false, required: true },
    { field: 'orderDate', title: 'Created at', input: 'input', type: 'datetime-local', create: false, editable: false, required: true },
    { field: 'requiredDate', title: 'Required date', input: 'input', type: 'datetime-local', create: true, editable: true, required: true },
    { field: 'pickUpDate', title: 'PickUp date', input: 'input', type: 'datetime-local', create: true, editable: true, required: false },
    { field: 'customerNumber', title: 'Customer ID', input: 'input', type: 'number', create: true, editable: true, required: true, popup: true },
    { field: 'total', title: 'Total', input: 'input', type: 'number', step: 0.01, create: true, editable: true, required: true },
    { field: 'status', title: 'Status', input: 'select', type: 'text', create: true, editable: true, required: true },
    { field: 'paymentCheckNumber', title: 'Payment check number', input: 'input', type: 'text', create: true, editable: true, required: false, popup: true },
    { field: 'pickUpOffice', title: 'Pickup office', input: 'select', type: 'text', create: true, editable: true, required: true },
    { field: 'details', title: 'Items', input: 'items', type: 'items', create: true, editable: true, required: true, items: 'true' },
    { field: 'comments', title: 'Comments', input: 'textarea', type: 'text', create: true, editable: true, required: false }
  ]
}

export const PaymentsDictionary = {
  entityName: 'Payments',
  stringURL: 'payments',
  tableTitles: ['Check Number', 'Date', 'Customer', 'Amount', 'Status', 'Method'],
  modelForm: [
    { field: 'checkNumber', title: 'Check number', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'customerNumber', title: 'Customer ID', input: 'input', type: 'number', create: true, editable: true, required: true, popup: true },
    { field: 'paymentDate', title: 'Payment date', input: 'input', type: 'datetime-local', create: true, editable: false, required: false },
    { field: 'amount', title: 'Amount', input: 'input', type: 'number', step: 0.01, create: true, editable: false, required: true },
    { field: 'paymentStatus', title: 'Status', input: 'select', type: 'text', create: true, editable: true, required: true },
    { field: 'paymentMethod', title: 'Method', input: 'select', type: 'text', create: true, editable: true, required: true }
  ]
}

export const CustomersDictionary = {
  entityName: 'Customers',
  stringURL: 'customers',
  tableTitles: ['Name', 'Address line', 'City', 'Country'],
  modelForm: [
    { field: 'customerNumber', title: 'Customer number', input: 'input', type: 'number', create: false, editable: false, required: true },
    { field: 'customerName', title: 'Name', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'contactLastName', title: 'Last name', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'contactFirstName', title: 'First name', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'phone', title: 'Phone', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'addressLine1', title: 'Address line 1', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'addressLine2', title: 'Address line 2', input: 'input', type: 'text', create: true, editable: true, required: false },
    { field: 'city', title: 'City', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'state', title: 'State', input: 'input', type: 'text', create: true, editable: true, required: false },
    { field: 'postalCode', title: 'Postal code', input: 'input', type: 'text', create: true, editable: true, required: false },
    { field: 'country', title: 'Country', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'salesRepEmployeeNumber', title: 'Sales employee', input: 'input', type: 'number', create: true, editable: true, required: true, popup: true },
    { field: 'creditLimit', title: 'Credit limit', input: 'input', type: 'number', step: 0.01, create: true, editable: true, required: true }
  ]
}

export const OfficesDictionary = {
  entityName: 'Offices',
  stringURL: 'offices',
  tableTitles: ['City', 'Address line', 'Country'],
  modelForm: [
    { field: 'id', title: 'Code', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'city', title: 'City', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'addressLine1', title: 'Address line 1', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'addressLine2', title: 'Address line 2', input: 'input', type: 'text', create: true, editable: true, required: false },
    { field: 'state', title: 'State', input: 'input', type: 'text', create: true, editable: true, required: false },
    { field: 'country', title: 'Country', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'postalCode', title: 'Postal code', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'territory', title: 'Territory', input: 'input', type: 'text', create: true, editable: true, required: true }
  ]
}

export const PaymentMethodsDictionary = {
  entityName: 'Payment methods',
  stringURL: 'paymentmethods',
  tableTitles: ['Type', 'Enabled'],
  modelForm: [
    { field: 'id', title: 'ID', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'type', title: 'Type', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'enabled', title: 'Enabled', input: 'input', type: 'boolean', create: true, editable: true, required: true }
  ]
}

export const PaymentStatusDictionary = {
  entityName: 'Payment status',
  stringURL: 'paymentstatus',
  tableTitles: ['Title', 'Description'],
  modelForm: [
    { field: 'id', title: 'ID', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'title', title: 'Title', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'description', title: 'Description', input: 'input', type: 'text', create: true, editable: true, required: true }
  ]
}

export const OrderStatusDictionary = {
  entityName: 'Order status',
  stringURL: 'orderstatus',
  tableTitles: ['Title', 'Description'],
  modelForm: [
    { field: 'id', title: 'ID', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'title', title: 'Title', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'description', title: 'Description', input: 'input', type: 'text', create: true, editable: true, required: true }
  ]
}

export const ProductLinesDictionary = {
  entityName: 'Product lines',
  stringURL: 'productlines',
  tableTitles: ['Title', 'Description'],
  modelForm: [
    { field: 'id', title: 'ID', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'title', title: 'Product line', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'description', title: 'Description', input: 'textarea', type: 'text', create: true, editable: true, required: false }
  ]
}

export const UsersDictionary = {
  entityName: 'Users',
  stringURL: 'users',
  tableTitles: ['Username', 'Register date', 'Last login', 'Active', 'Type'],
  modelForm: [
    { field: 'id', title: 'ID', input: 'input', type: 'text', create: false, editable: false, required: true },
    { field: 'username', title: 'Username', input: 'input', type: 'text', create: true, editable: false, required: true },
    { field: 'password', title: 'Password', input: 'input', type: 'password', create: true, editable: true, required: true },
    { field: 'registerAt', title: 'Register date', input: 'input', type: 'datetime-local', create: true, editable: true, required: true },
    { field: 'lastlogin', title: 'Last login', input: 'input', type: 'datetime-local', create: true, editable: true, required: false },
    { field: 'active', title: 'Active', input: 'input', type: 'text', create: true, editable: true, required: true },
    { field: 'usertype', title: 'Type', input: 'input', type: 'text', create: true, editable: true, required: true }
  ]
}
