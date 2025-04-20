import React from 'react'

const Loader = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center absolute inset-0 bg-white/10 backdrop-blur-sm z-50'>
      <div className='flex justify-center items-center gap-2'>
        <div className='w-6 h-6 bg-blue-600 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
        <div className='w-6 h-6 bg-blue-600 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
        <div className='w-6 h-6 bg-blue-600 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

export default Loader
