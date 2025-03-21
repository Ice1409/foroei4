"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MemoriesGalleryProps {
  images: string[]
}

const MemoriesGallery: React.FC<MemoriesGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(true)

  // Calculate how many images to show per view based on screen size
  const imagesPerView = typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 2
  const totalSlides = Math.ceil(images.length / imagesPerView)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= totalSlides ? 0 : nextIndex
    })
    setShowSwipeHint(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1
      return nextIndex < 0 ? totalSlides - 1 : nextIndex
    })
    setShowSwipeHint(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setShowSwipeHint(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
    setShowSwipeHint(false)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    // Reset values
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Mouse drag handling for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setTouchEnd(e.clientX)
    setShowSwipeHint(false)
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    if (touchStart && touchEnd) {
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      if (isLeftSwipe) {
        nextSlide()
      } else if (isRightSwipe) {
        prevSlide()
      }
    }

    // Reset values
    setIsDragging(false)
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Handle mouse leaving the carousel while dragging
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setTouchStart(null)
      setTouchEnd(null)
    }
  }

  // Hide swipe hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Get current images to display
  const getCurrentImages = () => {
    const startIdx = currentIndex * imagesPerView
    return images.slice(startIdx, startIdx + imagesPerView)
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
      {/* Swipe hint overlay */}
      {showSwipeHint && (
        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center z-20 animate-pulse">
          <div className="text-white flex flex-col items-center">
            <div className="flex items-center gap-2">
              <ChevronLeft size={24} />
              <span className="text-lg font-medium">Swipe</span>
              <ChevronRight size={24} />
            </div>
            <p className="text-sm mt-1">to see more memories</p>
          </div>
        </div>
      )}

      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`flex transition-transform duration-300 ease-out ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 flex gap-3">
              {images
                .slice(slideIndex * imagesPerView, slideIndex * imagesPerView + imagesPerView)
                .map((src, imgIndex) => (
                  <div
                    key={`${slideIndex}-${imgIndex}`}
                    className={`flex-1 aspect-square rounded-lg overflow-hidden shadow-md`}
                  >
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Memory ${slideIndex * imagesPerView + imgIndex + 1}`}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 shadow-md z-10 text-pink-500"
              aria-label="Previous memories"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 shadow-md z-10 text-pink-500"
              aria-label="Next memories"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-4 gap-1.5">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-pink-500 w-4" : "bg-pink-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MemoriesGallery

