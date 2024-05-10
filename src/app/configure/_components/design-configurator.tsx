'use client'

interface DesignConfiguratorProps {
  configId: string
  imageUrl: string
  imageDimensions: { width: number; height: number }
}

const DesignConfigurator = ({ configId, imageUrl, imageDimensions }: DesignConfiguratorProps) => {
  return (
    <div className='relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20'>
      <h1>{configId}</h1>
      <h1>{imageUrl}</h1>
      <h1>{imageDimensions.width}</h1>
      <h1>{imageDimensions.height}</h1>
    </div>
  )
}

export default DesignConfigurator
