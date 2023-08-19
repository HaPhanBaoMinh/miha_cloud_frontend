import React from 'react'
import withNoSSR from './NoSSR'
import { getFromNowShort } from '../utils'

function TimeAgoShort ({ datetimeStr, showSuffix, ...props }) {
  return (
    <>{getFromNowShort(datetimeStr, showSuffix)}</>
  )
}

export default withNoSSR(TimeAgoShort)
