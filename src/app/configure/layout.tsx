import MaxWidthWrapper from '@/components/app-ui/max-width-wrapper'
import { ReactNode } from 'react'
import Steps from './_components/Steps'

const ConfigureLayout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper className='flex-1 flex flex-col'>
      <Steps />
      {children}
    </MaxWidthWrapper>
  )
}

export default ConfigureLayout
