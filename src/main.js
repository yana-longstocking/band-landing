import './main.scss'

const ctaButton = document.querySelector('#cta-button')
const ctaBottom = document.querySelector('#cta-bottom')
const secondaryButton = document.querySelector('#secondary-button')

const handleScrollToFeatures = () => {
  const features = document.querySelector('#features')
  if (features) {
    features.scrollIntoView({ behavior: 'smooth' })
  }
}

ctaButton?.addEventListener('click', handleScrollToFeatures)
ctaBottom?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }),
)
secondaryButton?.addEventListener('click', handleScrollToFeatures)
