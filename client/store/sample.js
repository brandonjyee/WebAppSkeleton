import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_STUFF = 'GET_STUFF'

/**
 * INITIAL STATE
 */
const defaultStuff = {}

/**
 * ACTION CREATORS
 */
const gotStuff = payload => ({type: GET_STUFF, payload})

/**
 * THUNK CREATORS
 */
export const fetchStuff = () => async dispatch => {
  try {
    const res = await axios.get('/api/stuff')
    dispatch(gotStuff(res.data || defaultStuff))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultStuff, action) {
  switch (action.type) {
    case GET_STUFF:
      return action.payload
    default:
      return state
  }
}
