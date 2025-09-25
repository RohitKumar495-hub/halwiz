'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const CartPage = () => {
  const pathName = usePathname()
  return (
    <div className='grid gap-10'>
      <div className='bg-[#f6f5f8] p-4 text-center py-6 grid gap-4'>
        <h1 className='font-semibold text-amber-700 md:text-3xl'>Contact Us</h1>
        {
          <div className='flex gap-4 items-center justify-center'>
            <Link
              href="/">
              Home
            </Link>
            <p>/</p>
            <Link href='/contact' className={`${pathName === '/contact' ? 'font-semibold' : ' '}`}
            >Contact Us</Link>
          </div>
        }
      </div>
      <div className='flex lg:flex-row flex-col gap-3 '>
        <div className='lg:px-20 p-4 font-semibold grid gap-4 h-fit'>
          <h1 className='font-semibold text-2xl'>Contact Us</h1>
          <div>
            <p>Desi Tesi</p>
            <p>Borpathar, Basistha mandir, near lp school,</p>
            <p>781029 Guwahati AS, India</p>
            <p>Email: <a href="mailto:namastedesitesi@gmail.com" className='text-blue-500'>namastedesitesi@gmail.com</a></p>
          </div>

        </div>
        <div className="map-container rounded-md lg:w-[30%] lg:h-[300px] p-4 lg:p-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.4861959162464!2d84.33318591499838!3d24.34916998408705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e9afd2be86eb%3A0x63a3b07df2052ce1!2sDaltonganj%20Railway%20Station!5e0!3m2!1sen!2sin!4v1695650400000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className='lg:px-20 p-4 grid gap-4'>
        <h1 className='font-semibold text-amber-700 md:text-2xl'>Contact Us for Any Questions</h1>
        <form action="" className='grid gap-4'>
          <div className='grid'>
            <label htmlFor="name">Your Name</label>
            <input type="text" className='border border-gray-300 p-2 rounded outline-none' />
          </div>
          <div className='grid'>
            <label htmlFor="emai">Your Email</label>
            <input type="email" className='border border-gray-300 p-2 rounded outline-none' />
          </div>
          <div className='grid'>
            <label htmlFor="subject">Subject</label>
            <input type="text" className='border border-gray-300 p-2 rounded outline-none' />
          </div>
          <div className='grid'>
            <label htmlFor="message">Your message (optional)</label>
            <textarea className='border border-gray-300 p-2 rounded outline-none' />
          </div>
          <button className='bg-[#f5a70c] p-2 mt-6 font-semibold rounded w-20 cursor-pointer text-white'>Submit</button>
        </form>
      </div>
    </div >
  )
}

export default CartPage