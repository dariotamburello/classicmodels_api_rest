// import Notiflix from '../libs/notiflix.js'

export const formatDateToInput = (dateString) => {
  if (dateString === null) return null
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const commonHelpers = {
  openPopUp: function (popUp, overlay) {
    popUp.style.display = 'block'
    overlay.style.display = 'block'
  },
  validateResponse: function (response, location) {
    Notiflix.Loading.arrows()
    if (!response.ok) {
      Notiflix.Loading.remove()
      Notiflix.Notify.failure(response.statusText || 'An error occurred')
    } else {
      response.json().then(result => {
        if (result.error) {
          Notiflix.Loading.remove()
          return Notiflix.Notify.failure(result.error.errorTitle || 'An error occurred')
        }
        setInterval(() => {
          Notiflix.Loading.remove()
          location.reload()
        }, 1000)
      })
    }
  },
  closePopUp: function (popUp, overlay) {
    overlay.style.display = 'none'
    popUp.style.display = 'none'
  }
}

export const commonModifyDOM = {
  createAllInputs: function (formModel, editable) {
    const popupSelect = document.querySelector('#popup-select')
    const overlay2 = document.querySelector('#overlay-2')

    const html = formModel.map(async (input) => {
      if (input.input === 'items') return false
      if (!input.create && editable) return false
      const newLabel = document.createElement('label')
      newLabel.setAttribute('for', input.field)
      newLabel.textContent = input.title
      let newField = document.createElement(input.input)
      newField.setAttribute('type', input.type)
      newField.setAttribute('id', `view-input-${input.field}`)
      newField.setAttribute('name', input.field)
      if (input.required) {
        newField.setAttribute('required', input.required)
        newLabel.insertAdjacentHTML('beforeend', '<span>*<span/>')
      }
      if (input.step !== null) newField.setAttribute('step', input.step)
      if (input.input === 'select') newField = await commonModifyDOM.createSelectInput(input.field, newField, 'create', input.options)
      if (input.popup) {
        newField.addEventListener('click', function (e) {
          e.preventDefault()
          commonHelpers.openPopUp(popupSelect, overlay2)
          commonModifyDOM.updateTableToFind(input.field, 'createNew')
        })
      }
      if (!editable) newField.setAttribute('readonly', 'true')
      newField.className = 'pure-u-23-24'
      const wraperElement = document.createElement('div')
      wraperElement.className = 'pure-u-1 pure-u-md-1-3'
      wraperElement.appendChild(newLabel)
      wraperElement.appendChild(newField)
      return wraperElement
    })

    return html
  },
  updateAllViewInputs: function (fields, dataToFill) {
    const viewDetails = document.querySelector('#view-details')
    const viewImage = document.querySelector('#view-image')
    viewImage.innerHTML = ''
    for (const key in dataToFill) {
      if (key === 'details') {
        viewDetails.innerHTML = ''
        const detailsHTML = commonModifyDOM.updateViewDetails(dataToFill.details)
        viewDetails.insertAdjacentHTML('beforeend', detailsHTML)
      }
      if (dataToFill.productImage) {
        viewImage.innerHTML = `<a href='${dataToFill.productImage}' target='_blank'><img src='${dataToFill.productImage}' />`
      }
      const inputElement = document.getElementById(`view-input-${key}`)
      if (inputElement) {
        if (inputElement.tagName === 'SELECT') {
          for (const option of inputElement.options) {
            if (option.id === `${dataToFill[key]}`) {
              option.selected = true
              break
            }
          }
        } else if (inputElement.tagName === 'TEXTAREA') {
          inputElement.textContent = dataToFill[key]
        } else if (inputElement.getAttribute('type') === 'datetime-local') {
          inputElement.value = formatDateToInput(dataToFill[key])
        } else if (inputElement.tagName === 'ITEMS') {
          console.log('items')
        } else {
          inputElement.value = dataToFill[key]
        }
      }
    }
  },
  updateViewDetails: function (details) {
    if (details.length > 0) {
      let detailsHTML = `<table class='pure-table'>
            <thead>
                <tr>
                    <td>Order</td>
                    <td>Code</td>
                    <td>Description</td>
                    <td>Qty</td>
                    <td>Price</td>
                    <td>Sort</td>
                    <td>Image</td>
                </tr>
            </thead>
            <tbody>
        `
      details.sort((a, b) => a.orderLineNumber - b.orderLineNumber).map(orderDetails => {
        detailsHTML += '<tr>'
        for (const key in orderDetails) {
          if (key !== 'productId') detailsHTML += `<td>${orderDetails[key]}</td>`
        }
        detailsHTML += '</tr>'
        return true
      })
      detailsHTML += '</tbody><table/>'
      return detailsHTML
    } else { return '' }
  },
  createSelectInput: async function (type, selectElement, mode, options) {
    const optionDefault = document.createElement('option')
    optionDefault.setAttribute('id', 0)
    optionDefault.textContent = 'Please select'
    selectElement.appendChild(optionDefault)
    if (options !== undefined) {
      const optionsArray = options.split(',')
      optionsArray.forEach(opt => {
        const option = document.createElement('option')
        option.setAttribute('id', `${opt}`)
        option.setAttribute('data', `${opt}`)
        option.textContent = opt
        selectElement.appendChild(option)
        return true
      })
    }
    if (type === 'status') {
      const orderStatus = await commonActions.getEntity('orderstatus')
      orderStatus.map((status) => {
        const option = document.createElement('option')
        option.setAttribute('id', `${status.id}`)
        option.setAttribute('data', `${status.id}`)
        option.textContent = status.title
        selectElement.appendChild(option)
        return true
      })
    }
    if (type === 'paymentMethod') {
      const paymentMethods = await commonActions.getEntity('paymentmethods')
      paymentMethods.map((method) => {
        const option = document.createElement('option')
        option.setAttribute('id', `${method.id}`)
        option.setAttribute('data', `${method.id}`)
        option.textContent = method.type
        selectElement.appendChild(option)
        return true
      })
    }
    if (type === 'pickUpOffice') {
      const paymentMethods = await commonActions.getEntity('offices')
      paymentMethods.map((office) => {
        const option = document.createElement('option')
        option.setAttribute('id', `${office.id}`)
        option.setAttribute('data', `${office.id}`)
        option.textContent = office.addressLine1
        selectElement.appendChild(option)
        return true
      })
    }
    if (type === 'paymentStatus') {
      const paymentStatus = await commonActions.getEntity('paymentStatus')
      paymentStatus.map((status) => {
        const option = document.createElement('option')
        option.setAttribute('id', `${status.id}`)
        option.setAttribute('data', `${status.id}`)
        option.textContent = status.title
        selectElement.appendChild(option)
        return true
      })
    }
    if (type === 'productLine') {
      const productLines = await commonActions.getEntity('productLines')
      productLines.map((line) => {
        const option = document.createElement('option')
        option.setAttribute('id', `${line.id}`)
        option.setAttribute('data', `${line.title}`)
        option.textContent = line.title
        selectElement.appendChild(option)
        return true
      })
    }
    return selectElement
  },
  updateTableToFind: async function (modelToDisplay, mode) {
    const tableBodySelect = document.querySelector('#table-body-select')
    const popupSelect = document.querySelector('#popup-select')
    const overlay2 = document.querySelector('#overlay-2')

    let row = ''
    if (modelToDisplay === 'customerNumber') {
      const customers = await commonActions.getEntity('customers')
      customers.map((customer) => {
        row += `<tr>
                <td><a href='#' class='data-link' data-id='${customer.customerNumber}'>${customer.customerNumber}</a></td>
                <td>${customer.customerName}</td>
                <td>${customer.addressLine1}</td>
            </tr>`
        return true
      })
    } else if (modelToDisplay === 'paymentCheckNumber') {
      const payments = await commonActions.getEntity('payments')
      payments.map((payment) => {
        // TODO: validate 'customerNumber' and format 'paymentDate'
        row += `<tr>
                <td><a href='#' class='data-link' data-id='${payment.checkNumber}'>${payment.checkNumber}</a></td>
                <td>${payment.paymentDate}</td>
                <td>${payment.amount}</td>
                <td>${payment.status}</td>
            </tr>`
        return true
      })
    } else if (modelToDisplay === 'salesRepEmployeeNumber') {
      const employees = await commonActions.getEntity('employees')
      employees.map((employee) => {
        row += `<tr>
                <td><a href='#' class='data-link' data-id='${employee.employeeNumber}'>${employee.employeeNumber}</a></td>
                <td>${employee.lastName}</td>
                <td>${employee.firstName}</td>
                <td>${employee.email}</td>
            </tr>`
        return true
      })
    } else { return }
    tableBodySelect.innerHTML = row
    const dataLinks = document.querySelectorAll('.data-link')
    dataLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault()
        const id = this.getAttribute('data-id')
        if (mode === 'createNew') {
          const inputToUpdate = document.getElementById(`view-input-${modelToDisplay}`)
          inputToUpdate.value = id
        } else {
          commonModifyDOM.updateNewEditInput('', id)
        }
        commonHelpers.closePopUp(popupSelect, overlay2)
      })
    })
  },
  updateNewEditInput: function (tabSelected, dataTextArea) {
    const inputContent = document.querySelector('.editInput')
    if (inputContent.tagName === 'SELECT') {
      const optionToSelect = inputContent.querySelector(`option[id='${dataTextArea}']`)
      if (optionToSelect) {
        inputContent.value = optionToSelect.value
        inputContent.setAttribute('data', optionToSelect.getAttribute('id'))
      }
    } else if (inputContent.getAttribute('type') === 'datetime-local') {
      inputContent.value = formatDateToInput(dataTextArea)
    } else {
      dataTextArea === null ? inputContent.setAttribute('placeholder', 'N/D') : inputContent.value = dataTextArea
    }
  },
  createEditTabs: function (formModel) {
    return formModel.map((input) => {
      return `<li class="pure-menu-item editTab" id="${input.field}">
                <a class="pure-menu-link">${input.title}</a>
            </li>`
    }).join('')
  },
  createNewEditInput: async function (formModel, fieldSelected) {
    const popupSelect = document.querySelector('#popup-select')
    const overlay2 = document.querySelector('#overlay-2')

    const result = formModel.find((field) => field.field === fieldSelected)
    if (!result) return null
    const newInput = document.createElement(result.input)
    newInput.setAttribute('type', result.type)
    newInput.setAttribute('id', result.field)
    if (result.input === 'select') await commonModifyDOM.createSelectInput(result.field, newInput, 'edit', result.options)
    if (!result.editable) newInput.setAttribute('readonly', true)
    if (result.step !== null) newInput.setAttribute('step', result.step)
    if (result.editable && result.popup) {
      newInput.addEventListener('click', function () {
        commonHelpers.openPopUp(popupSelect, overlay2)
        commonModifyDOM.updateTableToFind(result.field)
      })
    }
    newInput.className = 'pure-input-1 editInput'
    return newInput
  },
  showPDF: (pdfPath) => {
    const pdfIframe = document.getElementById('pdfIframe')
    pdfIframe.src = pdfPath.filepath
    const downloadLink = document.getElementById('downloadPdf')
    downloadLink.href = pdfPath.filepath

    const modal = document.getElementById('pdfModal')
    modal.showModal()
  }
}

export const commonActions = {
  getEntity: async function (entity) {
    const response = await fetch(`/${entity}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const jsonResponse = await response.json()
    if (jsonResponse.error) {
      Notiflix.Loading.remove()
      return Notiflix.Notify.failure(jsonResponse.error.errorTitle || 'An error occurred')
    }
    return jsonResponse
  },
  searchInTable: async (value) => {
    const view = window.location.pathname
    window.location.href = view + '?page=1&search=' + value
  }
}
