/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import MaxWidthWrapper from '../app-ui/max-width-wrapper'
import ReviewGrid from './review-grid'

export function Reviews() {
  return (
    <MaxWidthWrapper className='relative max-w-5xl'>
      <img
        aria-hidden='true'
        src='/what-people-are-buying.png'
        className='absolute select-none hidden xl:block -left-32 top-1/3'
      />
      <ReviewGrid />
    </MaxWidthWrapper>
  )
}
