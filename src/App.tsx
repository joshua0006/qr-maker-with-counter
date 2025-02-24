import { useState, useRef, useEffect } from 'react'
import './App.css'
import QRCode from 'qrcode'
import { db, doc, setDoc, onSnapshot } from './firebase'

function App() {
  const [url, setUrl] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [scanCount, setScanCount] = useState(0)
  const [qrId, setQrId] = useState('')
  const unsubscribeRef = useRef<(() => void) | null>(null)

  const generateQRCode = async () => {
    try {
      if (!url) {
        alert('Please enter a valid URL');
        return;
      }

      // Validate URL format
      let targetUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        targetUrl = `https://${url}`;
        setUrl(targetUrl); // Update input with corrected URL
      }

      // Unsubscribe previous listener if exists
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }

      const newQrId = Date.now().toString()

      // Create the tracking URL
      const trackingUrl = `${window.location.origin}/redirect/${newQrId}`;
      
      // Generate QR code for the tracking URL instead of original URL
      const qrDataUrl = await QRCode.toDataURL(trackingUrl);
      
      const qrDocRef = doc(db, 'qrcodes', newQrId)

      // Set up real-time listener
      const unsubscribe = onSnapshot(qrDocRef, (doc) => {
        if (doc.exists()) {
          setScanCount(doc.data().scanCount)
        }
      })

      // Save original URL to Firebase
      await setDoc(qrDocRef, {
        url: targetUrl,
        scanCount: 0,
        createdAt: new Date().toISOString()
      })

      // Store unsubscribe function
      setQrCode(qrDataUrl)
      setQrId(newQrId)
      
      // Cleanup listener when component unmounts
      return () => unsubscribe()
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">QR Code Generator</h1>
        
        <div className="mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={generateQRCode}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Generate QR Code
        </button>

        {qrCode && (
          <div className="mt-6">
            <img src={qrCode} alt="QR Code" className="mx-auto w-48 h-48" />
            <p className="text-center mt-4 text-gray-600">
              Scan count: {scanCount}
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              QR Code URL: {window.location.origin}/redirect/{qrId}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
