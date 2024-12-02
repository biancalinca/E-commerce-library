import React from 'react'
import CategoryList from '../components/CategoryList'
// import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'

function Home() {
  return (
    <div className='text-green-950 font-semibold '>
      <CategoryList/>
      {/* <BannerProduct/> */}
      <HorizontalCardProduct category={"beletristica"} heading={"Cele mai îndrăgite" }/>
      <HorizontalCardProduct category={"romantic"} heading={"Cărți de dragoste" }/>
      <HorizontalCardProduct category={"fictiune"} heading={"Fictiune" }/>
      <HorizontalCardProduct category={"thriller"} heading={"Thriller" }/>
      <HorizontalCardProduct category={"fantastica"} heading={"Fantasy" }/>
      <HorizontalCardProduct category={"contemporana"} heading={"Contemporana" }/>
    </div>
  )
}

export default Home
