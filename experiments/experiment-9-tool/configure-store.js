import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const configureStore = () => {
	const store = createStore(
		rootReducer,
		applyMiddleware(thunk, createLogger())
	)

	return {
		store
	}
}

export default configureStore
