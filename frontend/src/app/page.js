import React from 'react'
import GetCode from './components/getCode'
const classes={
  Main:'h-screen w-full flex bg-[#252525] md:flex-row flex-col justify-center items-center gap-4',
  left:'h-full w-full bg-zinc-900 rounded-2xl',
  right:'h-full md:w-1/2 w-full bg-gray-600 rounded-2xl',
}

const Page = () => {
  return (
    <div className={classes.Main}>
      <div className={classes.left}><GetCode/></div>
    </div>
  )
}

export default Page
