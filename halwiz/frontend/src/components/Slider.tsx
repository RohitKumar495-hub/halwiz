'use client'
import React, { useEffect, useState } from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
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
    }, 3000) // change slide every 3s
    return () => clearInterval(interval)
  }, [instanceRef])

  return (
    <div className="relative w-full">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        <div className="keen-slider__slide">
          <img
            src="https://desitesi.com/wp-content/uploads/2025/08/desktop-poster-2.png"
            alt="Slide 1"
            className="w-full object-cover"
          />
        </div>
        <div className="keen-slider__slide">
          <img
            src="https://desitesi.com/wp-content/uploads/2025/08/Freshly-made-in-small-batches-crispy-sweet-and-full-of-love-Made-by-moms-using-traditional-Bihari-recipe-100-preservative-free-Delivered-fresh-in-5%E2%80%937-days-1.png"
            alt="Slide 2"
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 cursor-pointer -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 cursor-pointer -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
          >
            ›
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center gap-2 mt-4">
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
