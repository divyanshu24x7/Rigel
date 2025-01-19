import React from 'react'
import SideBar from './components/Sidebar'
import Header from './components/Header'
import Rightbar from './components/Rightbar'
import Compose from './components/Compose'

const App = () => {
  return (
    <div className='h-screen w-screen flex'>
      <SideBar />
      <section className='w-1/2'>
        <Header />
        <Compose />

      </section>
      <Rightbar />
    </div>
  )
}

export default App