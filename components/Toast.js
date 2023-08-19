import React from 'react'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Toast = ({ theme = 'light' } = {}) => <ToastContainer theme={theme} />

export default Toast
