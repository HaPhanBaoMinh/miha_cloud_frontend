export const initState = {
  avatarSet: {
    xs: '',
    sm: '',
    md: '',
    lg: '',
    xl: '',
    og: ''
  },
  isAuth: null,
  numJobs: null,
  numJobsFull: null,
  isEmployer: null,
  jobName: '',
  jobPhone: '',
  jobEmail: '',
  user: {
    username: '',
    email: '',
    dateJoined: ''
  }
}

const UserStore = (state = initState, action) => {
  if (action.type === 'UPDATE_USER') {
    return {
      ...state,
      ...action.payload
    }
  }

  if (action.type === 'RESET_USER') {
    return {
      ...state,
      ...initState
    }
  }

  return state
}

export default UserStore
