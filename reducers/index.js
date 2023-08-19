import { combineReducers } from 'redux'
import UserStore from './UserStore'

const rootReducer = combineReducers({
  UserStore: UserStore
})

export default rootReducer
