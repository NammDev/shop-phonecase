import { Suspense } from 'react'
import ThankYou from './_components/thank-you'

const Page = () => {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  )
}

export default Page
