"use client";
import React, { useState } from 'react'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentAccount, setCurrentAccount] = useState('');
    const [correctNetwork, setCorrectNetwork] = useState(false);
    const connectWallet = async () => {
      try {
        const { ethereum } = window
  
        if (!ethereum) {
          console.log('Metamask not detected')
          return
        }
        let chainId = await ethereum.request({ method: 'eth_chainId'})
        console.log('Connected to chain:' + chainId)
  
        const GoerlaChainId = '0x5'
  
        if (chainId !== GoerlaChainId) {
          alert('You are not connected to the Goerla Testnet!')
          return
        } else {
          setCorrectNetwork(true);
        }
  
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  
        console.log('Found account', accounts[0])
        
        setCurrentAccount(accounts[0])
      } catch (error) {
        console.log('Error connecting to metamask', error)
      }
    }  
      

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className="">
      <nav className="py-[1.5rem] pr-[7.5rem] pb-[1.9375rem] pl-[5.625rem] md:flex md:items-center md:justify-between">
        <div className="flex justify-between items-center ">
          <span className="text-2xl font-[Poppins] cursor-pointer">
            <img
              className="h-[1.875rem] w-[7.5rem] inline "
              src="/logo.png"

            />
          </span>

          <button
            className="text-3xl cursor-pointer mx-2 md:hidden block"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        <ul
          className={`md:flex md:items-center z-[-1] md:z-auto md:static absolute bg-white w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 ${
            menuOpen ? 'opacity-100 top-[80px]' : 'opacity-0 top-[-400px]'
          } transition-all ease-in duration-500`}
        >
           
      <li className="mx-6 my-4 md:my-0">
        <a onClick={connectWallet} className="text-[1.25rem] font-[700] font-source-sans-3 font-[#424242] hover:text-[#087A58] duration-500">{currentAccount ? currentAccount : "Connect Wallet"}</a>
      </li>
      
        </ul>
      </nav>
    </div>
  )
}

export default Navbar