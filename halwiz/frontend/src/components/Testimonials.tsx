'use client'
import React, { useEffect, useState } from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        perView: 3, // default: show 3 at once
        spacing: 15,
      },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 2, spacing: 15 }, // 2 on tablet
        },
        "(max-width: 640px)": {
          slides: { perView: 1, spacing: 10 }, // 1 on mobile
        },
      },
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel)
      },
      created() {
        setLoaded(true)
      },
    }
  )

  // ✅ Auto slide effect
  useEffect(() => {
    if (!instanceRef.current) return
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 4000) // change slide every 4s
    return () => clearInterval(interval)
  }, [instanceRef])

  const TestimonialData = [
    {
      id: '1',
      name: 'Elizabeth Olsen',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis aperiam labore repellat eveniet reiciendis excepturi facere animi cupiditate reprehenderit temporibus.',
    },
    {
      id: '2',
      name: 'Chris Evans',
      description:
        'Dolorem repellat voluptate, voluptatibus veritatis odit voluptatem. Minus unde aliquid temporibus culpa. Modi nemo quia accusantium mollitia!',
    },
    {
      id: '3',
      name: 'Robert Downey Jr.',
      description:
        'Possimus dolore laboriosam atque, numquam quod expedita, inventore aperiam at rem accusantium quidem, ipsa nihil debitis!',
    },
    {
      id: '4',
      name: 'Scarlett Johansson',
      description:
        'Tempora asperiores explicabo harum ad adipisci, nostrum porro delectus, nesciunt sint, cum ex amet sit optio.',
    },
    {
      id: '5',
      name: 'Tom Holland',
      description:
        'Nesciunt error fugiat vitae perferendis aspernatur nobis repellat magnam dolores officia necessitatibus.',
    },
  ]

  return (
    <div className="relative w-full mt-10 bg-[#f6f5f7] py-10">
      <h2 className="text-center font-semibold text-2xl mb-8">
        Our Testimonials
      </h2>

      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {TestimonialData.map((data, index) => (
          <div
            key={data.id + index}
            className="keen-slider__slide flex justify-center px-2"
          >
            <div className="bg-white w-full max-w-md shadow rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border overflow-hidden">
                  <img
                    src="https://tse4.mm.bing.net/th/id/OIP.A7FC7of-eflrVY3BVt2RxQHaJH?pid=Api&P=0&h=180"
                    alt={data.name}
                    className="rounded-full w-full h-full object-cover object-center"
                  />
                </div>
                <p className="font-semibold">{data.name}</p>
              </div>
              <p className="text-gray-700 text-justify">{data.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {/* {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
          >
            ›
          </button>
        </>
      )} */}

      {/* Pagination Dots */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center gap-2 mt-6">
          {[
            ...Array(instanceRef.current.track.details.slides.length).keys(),
          ].map((idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === idx ? 'bg-blue-600' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
