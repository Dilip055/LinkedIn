
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Userlayout = ({children}) => {
    
  return (
    <>
    <Navbar />
    <div>{children}</div>
    </>
    
  )
}

export default Userlayout