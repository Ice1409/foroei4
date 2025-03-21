import type React from "react"

interface BrushStrokeProps {
  color: string
  width: string | number
  height: string | number
  className?: string
}

const BrushStroke: React.FC<BrushStrokeProps> = ({ color, width, height, className = "" }) => {
  // Random number between min and max
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

  // Generate a random ID for the filter
  const filterId = `brush-filter-${Math.random().toString(36).substring(2, 9)}`

  return (
    <svg width={width} height={height} viewBox="0 0 800 200" className={className} preserveAspectRatio="none">
      <defs>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path
        d={`M0,${random(80, 120)} 
           C${random(100, 200)},${random(50, 150)} 
            ${random(300, 500)},${random(50, 150)} 
            ${random(600, 700)},${random(80, 120)} 
            ${random(700, 750)},${random(80, 120)} 
            800,${random(80, 120)}`}
        fill={color}
        filter={`url(#${filterId})`}
      />
    </svg>
  )
}

export default BrushStroke

