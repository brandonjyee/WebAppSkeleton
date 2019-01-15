import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import sample from './sample'

const reducer = combineReducers({
  sample,
  // Other reducers here
})
const middleware = composeWithDevTools(
  // Middleware order matters. Make sure the logger is the last middleware to avoid
  // misleading logs
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
