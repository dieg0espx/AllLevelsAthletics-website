import { Star } from "lucide-react"
import { memo } from "react"

interface StarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const Stars = memo(function Stars({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  className = "" 
}: StarsProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  }

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const isFilled = index < rating
    return (
      <Star
        key={index}
        className={`${sizeClasses[size]} ${
          isFilled 
            ? "fill-amber-400 text-amber-400" 
            : "fill-transparent text-amber-400/30"
        } ${className}`}
        aria-hidden="true"
      />
    )
  })

  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      {stars}
    </div>
  )
})

Stars.displayName = "Stars"

export default Stars
