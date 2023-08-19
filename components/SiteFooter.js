import React from 'react'
import styled from '@emotion/styled'
import tw from 'twin.macro'
import dayjs from 'dayjs'
import { BRAND_NAME } from '../constants'

function SiteFooter (props) {
  return (
    <Footer>
      <div className='container mx-auto px-4'>
        <div className='font-heading items-center text-xs text-gray-500'>&copy; 2022-{dayjs().year()} {BRAND_NAME}.</div>
      </div>
    </Footer>
  )
}

export default SiteFooter

// language=SCSS prefix=*{ suffix=}
const Footer = styled.div`
  ${tw`
    py-8
  `}
`
