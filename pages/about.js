import React from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { BRAND_NAME, SITE_BASE_URL } from '../constants'
import { NextSeo } from 'next-seo'

function Intro () {
  const pageTitle = `Giới thiệu về ${BRAND_NAME}`
  const pageDesc = `Những việc làm mới được cập nhật tại ${BRAND_NAME}, chia sẽ với bạn bè công việc thú vị có thể giúp bạn kiếm thêm thu nhập.`

  return (
    <Div>
      <NextSeo
        title={`${pageTitle} - ${BRAND_NAME}`}
        description={pageDesc}
        canonical={SITE_BASE_URL}
      />

      <h1 className='text-sm uppercase font-bold font-heading text-gray-400 mb-4'>
        Giới thiệu về ViecLamUIT
      </h1>

      <p>
        ViecLamUIT (Việc làm UIT) là một dự án nhỏ được tôi tranh thủ làm vào mỗi cuối tuần. Là một cựu sinh viên của UIT, tôi rất mong
        được đóng góp cho trường cũng như tạo kết nối giữa cộng đồng sinh viên.
      </p>

      <p>
        Ý tưởng website rất đơn giản, bất cứ ai cũng có thể đăng việc tại đây nhưng chỉ sinh viên của trường mới có thể thấy và apply.
        Bất cứ việc gì cũng có thể được chấp nhận, không nhất thiết phải là IT. Miễn sao những việc đó là hợp pháp,
        mang lại cho sinh viên của trường nguồn thu nhập chính đáng để có thêm động lực học tập và cải thiện cuộc sống thời sinh viên.
      </p>

      <p>
        Nếu bạn thấy website này hữu ích thì hãy giới thiệu cho bạn bè trong trường nhé!
      </p>
    </Div>
  )
}

export default Intro

// language=SCSS prefix=*{ suffix=}
const Div = styled.div`
  ${tw`
    container px-4 mx-auto
  `}
  
  p {
    ${tw`mb-4`}
  }
`
