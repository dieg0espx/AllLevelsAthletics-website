"use client"

import { useState } from 'react'

export default function TestReactPage() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    alert('React button clicked!')
    console.log('🎯 React button clicked!')
    setCount(count + 1)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">React Event Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Test React Event Handling</h2>
            <p className="text-gray-600 mb-6">
              This page tests if React event handling is working properly.
            </p>
          </div>

          {/* Simple React Button */}
          <div className="text-center">
            <button
              onClick={handleClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              Click Me! (Count: {count})
            </button>
          </div>

          {/* Raw HTML Button */}
          <div className="text-center">
            <button
              id="html-button"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
            >
              Raw HTML Button
            </button>
          </div>

          {/* Test Results */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <ul className="space-y-1 text-sm">
              <li>✅ Page renders: {typeof window !== 'undefined' ? 'Yes' : 'No'}</li>
              <li>✅ React useState works: {count}</li>
              <li>❓ React onClick works: Click the blue button above</li>
              <li>❓ Raw HTML works: Click the green button above</li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Click the blue "Click Me!" button</li>
              <li>Click the green "Raw HTML Button"</li>
              <li>Check the browser console for logs</li>
              <li>Check if alerts appear</li>
            </ol>
          </div>
        </div>
      </div>

      {/* JavaScript to test raw HTML button */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('html-button').addEventListener('click', function() {
            alert('Raw HTML button works!');
            console.log('🎯 Raw HTML button clicked!');
          });
        `
      }} />
    </div>
  )
}
