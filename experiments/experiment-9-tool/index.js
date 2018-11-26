import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import insertCss from 'insert-css'

import configureStore from './configure-store'

import App from './containers/App'

import normalizeCss from 'normalize.css'
import globalStyles from './styles.css'

insertCss(`
${normalizeCss}
${globalStyles}
`)

const { store } = configureStore()

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
