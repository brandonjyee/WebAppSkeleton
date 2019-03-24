import {createBrowserHistory as createHistory} from 'history'
import {createMemoryHistory} from 'history'

const history =
  process.env.NODE_ENV === 'test' ? createMemoryHistory() : createHistory()

export default history
