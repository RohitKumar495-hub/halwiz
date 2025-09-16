import Link from 'next/link'
import React from 'react'
import { FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    const usefulLinks = [
        {name: 'Terms and Conditions' , url:'/terms'},
        {name: 'Cancellation and Refund' , url:'/refund'},
        {name: 'Shipping and Delivery' , url:'/shipping'},
        {name: 'Contact Us' , url:'/contact'},
    ]

    const quickLinks = [
        {name: 'Track Your Order' , url:'/track-order'},
        {name: 'About Us' , url:'/about'},
        {name: 'FAQs' , url:'/faqs'},
        {name: 'Work With Us' , url:'/shipping'},
    ]
  return (
        <div className='grid md:grid-cols-2 lg:grid-cols-4 justify-center gap-4 p-4 lg:place-items-center mt-10 mb-16 lg:mb-0 bg-red-50'>
            <div className='grid gap-4'>
                <Link href="/">
                    <img src="/logo.png" alt="" className='w-25'/>
                </Link>
                <p className='text-justify'>Halwiz is a homegrown food startup bringing authentic, preservative-free Bihari snacks to modern Indian homes.</p>
                <h3 className='font-semibold'>Social Links</h3>
                <div className='flex gap-4'>
                    <Link href={'/'}>
                        <FaInstagram size={25} color='pink'/>
                    </Link>
                    <Link href={'/'}>
                        <FaXTwitter size={25} color='red'/>
                    </Link>
                </div>
            </div>
            <div className='grid gap-3'>
                <h2 className='font-semibold border-b-2 border-b-red-500 mb-2'>Useful Links</h2>
                {
                    usefulLinks.map((link , index) => {
                        return (
                            <Link href={link.url} key={index} className='hover:text-red-500'>{link.name}</Link>
                        )
                    })
                }
            </div>
            <div className='grid gap-3'>
                <h2 className='font-semibold border-b-2 border-b-red-500 mb-2'>Quick Links</h2>
                {
                    quickLinks.map((link , index) => {
                        return (
                            <Link href={link.url} key={index} className='hover:text-red-500'>{link.name}</Link>
                        )
                    })
                }
            </div>
            <div className='grid gap-3'>
                <h2 className='font-semibold border-b-2 border-b-red-500 mb-2'>Contact Us</h2>
                <p>Halwiz</p>
                <p>Daltonganj, Jharkhand</p>
                <p>852017, India</p>
                <Link href={'/'} className='flex'> Email : <p className='text-blue-700'>halwiz@gmail.com</p></Link>
            </div>
        </div>
  )
}

export default Footer