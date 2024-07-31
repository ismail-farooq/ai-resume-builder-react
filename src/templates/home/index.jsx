import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/clerk-react'
import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <Header></Header>
      Home Screen
      <section style={{ background: '#f4f4f4', padding: '4rem 0', textAlign: 'center' }}>
      <div style={{width: '80%',
  margin:' 0 auto'}}>
        <h2 className='font-bold text-lg'>Create Your Perfect Resume</h2>
        <p className='my-2 pb-4'>Let AI help you build a professional resume in minutes.</p>
        <Link to={'/dashboard'}><Button>Get Started</Button></Link>
      </div>
    </section>
    </div>
  )
}

export default Home