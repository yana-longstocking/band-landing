import './main.scss'

const aboutUsButton = document.querySelector('.about-us__button')
const concertsButtons = document.querySelectorAll('.concerts__button')
const contactsForm = document.querySelector('.contacts__form')
const popup = document.querySelector('#popup')
const popupText = document.querySelector('#popup-text')
const popupCloseControls = document.querySelectorAll('[data-popup-close]')

const openPopup = (message) => {
  if (!popup || !popupText) {
    return
  }

  popupText.textContent = message
  popup.classList.add('popup--open')
  popup.setAttribute('aria-hidden', 'false')
}

const closePopup = () => {
  if (!popup) {
    return
  }

  popup.classList.remove('popup--open')
  popup.setAttribute('aria-hidden', 'true')
}

aboutUsButton?.addEventListener('click', () => {
  openPopup('Дякуємо! Ваш квиток замовлено.')
})

concertsButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault()

    const row = button.closest('.concerts__row')
    const cityCell = row?.querySelector('.concerts__cell')
    const city = cityCell?.textContent?.trim() || 'обраний концерт'
    const dateCell = row?.querySelector('.concerts__cell:nth-child(3)')
    const date = dateCell?.textContent?.trim() || 'обраний дата і час'

    openPopup(`Квиток замовлено: ${city}, ${date}`)
  })
})

contactsForm?.addEventListener('submit', (event) => {
  event.preventDefault()
  openPopup('Дякуємо! Ваше повідомлення відправлено.')
  contactsForm.reset()
})

popupCloseControls.forEach((control) => {
  control.addEventListener('click', closePopup)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePopup()
  }
})
