'use client'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

const AboutPage = () => {
  const pathName = usePathname()

  return (
    <div className='grid gap-8'>
      <div className='bg-[#f6f5f8] p-4 text-center py-6 grid gap-4'>
        <h1 className='font-semibold text-amber-700 md:text-3xl'>About Us</h1>
        {
          <div className='flex gap-4 items-center justify-center'>
            <Link href="/">
              Home
            </Link>
            <p>/</p>
            <Link href='/about' className={`${pathName === '/about' ? 'font-semibold' : ' '}`}
            >About Us</Link>
          </div>
        }
      </div>
      <div className='px-10'>
        <div className='grid gap-3'>
          <h1 className='font-semibold text-xl'>Halwiz</h1>
          <p><span className='font-semibold'>Established on April 3, 2025, Halwiz</span> is a Jharkhand-based brand committed to offering high-quality food products rooted in authenticity and taste. Our mission is to deliver wholesome, flavorful experiences to your table through carefully crafted, locally inspired offerings that celebrate the richness of Indian tradition.</p>
        </div>
        <h1 className='font-semibold text-xl mt-4 mb-4'>Our Main Goal Is</h1>
        <div className='grid gap-3'>
          <div className='grid'>
            <h2 className='font-semibold'>Preserve Bihar’s Food Heritage</h2>
            <p>We aim to bring lost and lesser-known Bihari snacks to every household, keeping our traditional recipes alive for future generations.</p>
          </div>
          <div>
            <h1 className='font-semibold'>Launch 100% Natural Product Range</h1>
            <p>We’re expanding into healthy, preservative-free products like flavored makhana and natural honey—keeping taste and wellness together.</p>
          </div>
          <div>
            <h1 className='font-semibold'>Empower Local Hands</h1>
            <p>Our mission is to create more jobs by training and working with local women and small artisans who carry forward the real taste of Bihar.</p>
          </div>
          <div>
            <h1 className='font-semibold'>Take Bihar’s Taste Global</h1>
            <p>We want Desi Tesi to become a global name for authentic Bihari snacks—loved not just in India, but across the world.</p>
          </div>
        </div>
      </div>
      <div className='px-10'>
        <div className='flex gap-20 flex-col md:flex-row'>
          <div className='grid gap-2 lg:w-90'>
            <div className=''>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxglj3iwmlB9Y9oZBH3qicAgZcnj6dtdHN2Q&s" alt="ceo" className='w-90 h-70 rounded-md' />
            </div>
            <div className='grid gap-2'>
              <h1 className='font-semibold text-lg'>Unkown Person</h1>
              <div className='text-[#848181] grid gap-2'>
                <p className='font-semibold'>Co founder and manufacturing head</p>
                <p className='text-justify'>Meet Chand Jyoti Devi – The Heart Behind Our Flavors
                  Chand Jyoti Devi is the backbone of Desi Tesi’s manufacturing. From day one, she has taken charge of preparing our signature snacks like thekua and gujiya with love, care, and unmatched dedication. Her deep knowledge of traditional Bihari recipes and attention to quality ensure that every bite reflects the true taste of Bihar. She’s not just a homemaker—she’s a key force driving the spirit and soul of Desi Tesi.</p>
              </div>

            </div>
          </div>
          <div className='grid gap-2 lg:w-90'>
            <div>
              <img src="https://photosly.net/wp-content/uploads/2023/12/cute-girl-pic99.jpg" alt="" className='w-90 h-70 rounded-md' />
            </div>
            <div className='grid gap-2'>
              <h1 className='font-semibold text-lg'>Unkown Person</h1>
              <div className='text-[#848181] grid gap-2'>
                <p className='font-semibold'>Co founder and manufacturing head</p>
                <p className='text-justify'>Meet Chand Jyoti Devi – The Heart Behind Our Flavors
                  Chand Jyoti Devi is the backbone of Desi Tesi’s manufacturing. From day one, she has taken charge of preparing our signature snacks like thekua and gujiya with love, care, and unmatched dedication. Her deep knowledge of traditional Bihari recipes and attention to quality ensure that every bite reflects the true taste of Bihar. She’s not just a homemaker—she’s a key force driving the spirit and soul of Desi Tesi.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AboutPage