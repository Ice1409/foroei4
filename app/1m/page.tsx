"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import MemoriesGallery from "@/components/memories-gallery"

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showMessage, setShowMessage] = useState(false)
  const [isCountdownFinished, setIsCountdownFinished] = useState(false)


  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const startDate = new Date("2025-02-22T23:32:00") // วันที่เริ่มคบกัน

  const targetDate = new Date("2025-03-22T23:32:00") // วันที่และเวลาที่ต้องการให้ Countdown ถึง

  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Countdown Logic
  useEffect(() => {
      const calculateTimeTogether = () => {
        const now = new Date();
        const diff = now.getTime() - startDate.getTime();
  
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365)); // ปี
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)); // เดือน
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)); // วัน
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // ชั่วโมง
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // นาที
        const seconds = Math.floor((diff % (1000 * 60)) / 1000); // วินาที
  
        setTimeTogether({ years, months, days, hours, minutes, seconds });
      };
  
      calculateTimeTogether();
      const interval = setInterval(calculateTimeTogether, 1000); // อัปเดตทุกวินาที
  
      return () => clearInterval(interval);
    }, []);
  
  useEffect(() => {

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
  
      if (difference <= 0) {
        clearInterval(interval);
        setIsCountdownFinished(true);
        return;
      }
  
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [])

  // ส่วนอื่นๆ ของโค้ด (เช่น การคำนวณเวลาที่คบกัน, Audio Player, ฯลฯ) ...
  // Sample images for the memories gallery
    const memoryImages = [
        "/Oei (1).jpg?height=200&width=200",
        "/Oei (2).jpg?height=200&width=200",
        "/Oei (3).jpg?height=200&width=200",
        "/Oei (4).jpg?height=200&width=200",
        "/Oei (5).jpg?height=200&width=200",
        "/Oei (6).jpg?height=200&width=200",
        "/Oei (7).jpg?height=200&width=200",
        "/Oei (8).jpg?height=200&width=200",
        "/Oei (9).jpg?height=200&width=200",
        "/Oei (10).jpg?height=200&width=200",
        "/Oei (11).jpg?height=200&width=200",
        "/Oei (12).jpg?height=200&width=200",
        "/Oei (13).jpg?height=200&width=200",
        "/Oei (14).jpg?height=200&width=200",
        "/Oei (15).jpg?height=200&width=200",
        "/Oei (16).jpg?height=200&width=200",
        "/Oei (17).jpg?height=200&width=200",
        "/Oei (18).jpg?height=200&width=200",
      ]
    
      const togglePlay = () => {
        if (isPlaying) {
          audioRef.current?.pause()
        } else {
          audioRef.current?.play().catch(error => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
          })
        }
        setIsPlaying(!isPlaying)
      }
      
      const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      }
      
      const handleTimeUpdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }
      
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          console.log("Metadata loaded, duration:", audioRef.current.duration)
          setDuration(audioRef.current.duration)
        }
      }
      
      const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number.parseFloat(e.target.value)
        setCurrentTime(newTime)
        if (audioRef.current) {
          audioRef.current.currentTime = newTime
        }
      }
      
      const handleSkipBack = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
        }
      }
      
      const handleSkipForward = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
        }
      }
      
      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
      }
    
      useEffect(() => {
        const audio = audioRef.current
    
        if (audio) {
          audio.addEventListener("timeupdate", handleTimeUpdate)
          audio.addEventListener("loadedmetadata", handleLoadedMetadata)
          audio.addEventListener("ended", () => setIsPlaying(false))
        }
    
        // Show the message after 3 seconds
        const timer = setTimeout(() => {
          setShowMessage(true)
        }, 3000)
    
        return () => {
          if (audio) {
            audio.removeEventListener("timeupdate", handleTimeUpdate)
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audio.removeEventListener("ended", () => setIsPlaying(false))
          }
          clearTimeout(timer)
        }
      }, [])
    
      // Floating animation for decorative elements
      const floatingAnimation = "animate-[float_6s_ease-in-out_infinite]"
      const floatingAnimationSlow = "animate-[float_8s_ease-in-out_infinite]"
      const floatingAnimationFast = "animate-[float_4s_ease-in-out_infinite]"

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-100 to-blue-100 py-10">
      {/* Decorative elements */}
      <div className={`absolute top-10 right-20 text-pink-400 text-4xl ${floatingAnimationSlow}`}>💕</div>
      <div className={`absolute top-40 left-20 text-pink-400 text-4xl ${floatingAnimation}`}>💗</div>
      <div className={`absolute bottom-40 right-40 text-pink-400 text-4xl ${floatingAnimationFast}`}>💌</div>
      <div className={`absolute bottom-20 left-40 text-pink-400 text-4xl ${floatingAnimation}`}>❤️</div>
      <div className={`absolute top-1/4 right-1/4 text-pink-300 text-2xl ${floatingAnimationSlow}`}>❣️</div>
      <div className={`absolute bottom-1/4 left-1/3 text-pink-300 text-2xl ${floatingAnimationFast}`}>💓</div>
      {/* Countdown Section */}
      {!isCountdownFinished && (
        <div className="text-center animate-[fadeIn_1s_ease-in]">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-500 mb-10">Countdown to Our Special Day</h1>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500 ">
                {timeLeft.days}
              </div>
              <p className="text-xs mt-1 text-gray-600">Days</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
                {timeLeft.hours}
              </div>
              <p className="text-xs mt-1 text-gray-600">Hours</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
                {timeLeft.minutes}
              </div>
              <p className="text-xs mt-1 text-gray-600">Minutes</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
                {timeLeft.seconds}
              </div>
              <p className="text-xs mt-1 text-gray-600">Seconds</p>
              <p className="text-xs mt-1 text-gray-600 mb-10"></p>
            </div>
          </div>
        </div>
        
      )}

      {/* ส่วนอื่นๆ ของหน้าเว็บ */}
      {isCountdownFinished && (
        <>
          {/* Title */}
          <div className="text-center mb-8 animate-[fadeIn_1s_ease-in]">
            <h1 className="text-4xl md:text-5xl font-bold text-pink-400 mt-2">Happy</h1>
            <h1 className="text-4xl md:text-5xl font-bold text-pink-500 mt-2">1 Month</h1>
            <h2 className="text-4xl md:text-5xl font-bold text-pink-400 mt-2">
              <span className="inline-block ml-2 animate-bounce text-red-500">❤️</span>
              Anniversary!
              <span className="inline-block ml-2 animate-bounce text-red-500">❤️</span>
            </h2>
          </div>

          {/* Main image with floating decorations */}
      <div className="relative mb-12 animate-[fadeIn_1.5s_ease-in]">
        <div className={`absolute -top-10 -left-10 rotate-[-10deg] z-10 ${floatingAnimationSlow}`}>
          <div className="w-16 h-20 bg-white rounded-md shadow-md overflow-hidden">
            <Image
              src="/Oei (1).jpg?height=80&width=64"
              alt="Decoration"
              width={64}
              height={80}
              className="object-cover"
            />
          </div>
        </div>

        <div className={`absolute -top-5 -right-10 rotate-[10deg] z-10 ${floatingAnimation}`}>
          <div className="w-16 h-20 bg-white rounded-md shadow-md overflow-hidden">
          <Image
              src="/top2.jpg?height=80&width=64"
              alt="Decoration"
              width={64}
              height={80}
              className="object-cover"
            />
          </div>
        </div>

        <div className={`absolute -bottom-5 -right-5 rotate-[5deg] z-10 ${floatingAnimationFast}`}>
          <div className="w-14 h-18 bg-white rounded-md shadow-md overflow-hidden">
          <Image
              src="/Oei (2).jpg?height=80&width=64"
              alt="Decoration"
              width={64}
              height={80}
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-lg">
          <Image
            src="/ku.jpg?height=320&width=320"
            alt="Birthday Person"
            width={320}
            height={320}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Audio player */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-[90%] max-w-md mb-8 animate-[fadeIn_2s_ease-in]">
        <div className="text-center mb-3">
          <p className="text-gray-700 font-medium">ตั้งแต่มีเธอฉันมีความสุข(This Time)</p>
          <p className="text-gray-500 text-sm">เพลงให้เอยยย</p>
          <p className="text-gray-400 text-xs mt-1">Violette Wautier</p>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
          <span className="text-sm text-gray-600">{formatTime(duration)}</span>
        </div>

        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-400"
        />

        <div className="flex justify-center items-center gap-6 mt-4">
          <button onClick={handleSkipBack} className="text-gray-600 hover:text-gray-800">
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          <button onClick={handleSkipForward} className="text-gray-600 hover:text-gray-800">
            <SkipForward size={24} />
          </button>
        </div>

        <audio 
          ref={audioRef} 
          src="/birthday-song.mp3" 
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={(e) => console.error("Audio error:", e)}
        />
      </div>

      
      {/* Birthday message */}
      <div
        className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-[90%] max-w-md mb-8 transition-all duration-1000 ${
          showMessage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h3 className="text-xl font-bold text-pink-500 mb-3 text-center">Special Message</h3>
        <p className="text-gray-700 mb-3">
          เห้ยครบรอบ 1 เดือนละเร้วดีน่อ 1 เดือนที่ผ่านมาอะดีมากๆ เลยนะ กุค่ตจะมีความสุขเลย 
          ได้แลกเปลี่ยนอะไรหลายๆ อย่างได้ทำอะไรใหม่ๆ ถึงจะมีไม่เข้าใจกันบ้าง ผิดใจกันบ้าง ทะเลาะกันบ้าง แต่มันก้ทำให้เราเข้าใจกันมากขึ้นนะ เราคงเข้าใจกันและกันมากขึ้นมาเลยเนาะ 😄
        </p>
        <p className="text-gray-700 mb-3">
          กุดีใจนะ ดีใจมากๆ ด้วยที่มีมึงเป็นแฟนอะ หลังจากนี้ถ้ามีอะไรให้ผิดใจกันก้หวังว่าจะไม่ปล่อยกันและผ่านมันไปได้นะ อยากอยู่ด้วยไปนานๆ เล้ยยย รักแฟนมากๆ เลยนะะ 💕
        </p>
        <p className="text-gray-700 text-right font-medium">รักแฟนนน 🫶🏻,</p>
        <p className="text-gray-700 text-right">จาก แฟนที่รักมึงค่ตๆ 😋</p>
      </div>

      {/* Photo gallery - Memories Together with swipeable carousel */}
      <div className="w-[90%] max-w-md mb-8 animate-[fadeIn_2.5s_ease-in]">
        <h3 className="text-xl font-bold text-pink-500 mb-4 text-center">Memories from Our First Month</h3>
        <MemoriesGallery images={memoryImages} />
      </div>

      {/* Birthday countdown */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-[90%] max-w-md mb-12 animate-[fadeIn_3s_ease-in]">
        <h3 className="text-xl font-bold text-pink-500 mb-3 text-center">We've been in a relationship for</h3>
        <div className="flex justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
            {timeTogether.months}
          </div>
          <p className="text-xs mt-1 text-gray-600">Month</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
            {timeTogether.days}
          </div>
          <p className="text-xs mt-1 text-gray-600">Days</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
            {timeTogether.hours}
          </div>
          <p className="text-xs mt-1 text-gray-600">Hours</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
            {timeTogether.minutes}
          </div>
          <p className="text-xs mt-1 text-gray-600">Minutes</p>
        </div>
        <div className="text-center">
          <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-pink-500">
            {timeTogether.seconds}
          </div>
          <p className="text-xs mt-1 text-gray-600">Seconds</p>
        </div>
      </div>

        <p className="text-center text-gray-700">Glad to have you, Oei. ❤️</p>
      </div>
        </>
      )}
      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mb-4">
        <p>Made with ❤️ for Our special day</p>
        <p className="mt-1">© {new Date().getFullYear()} From ICE</p>
      </footer>
      
    </main>
  )
}