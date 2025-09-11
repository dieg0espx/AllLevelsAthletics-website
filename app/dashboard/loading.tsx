export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-white mb-2">Loading Dashboard...</h1>
          <p className="text-white/70">Preparing your fitness journey</p>
        </div>
      </div>
    </div>
  )
}
