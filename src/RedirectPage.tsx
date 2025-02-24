import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, updateDoc, increment, getDoc } from './firebase';

export function RedirectPage() {
  const { qrId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const trackScan = async () => {
      if (!qrId) {
        navigate('/');
        return;
      }

      try {
        const qrDoc = doc(db, 'qrcodes', qrId);
        
        // First get the current document to ensure it exists
        const docSnap = await getDoc(qrDoc);
        
        if (!docSnap.exists()) {
          navigate('/');
          return;
        }

        // Update the scan count
        await updateDoc(qrDoc, {
          scanCount: increment(1)
        });

        // Redirect to the original URL
        const targetUrl = docSnap.data().url;
        if (targetUrl) {
          // Use replace instead of href to prevent back button issues
          window.location.replace(targetUrl);
        } else {
          navigate('/error');
        }
        
      } catch (error) {
        console.error('Redirect error:', error);
        navigate('/error');
      }
    };

    trackScan();
  }, [qrId, navigate]);

  return (
    <div className="text-center p-8">
      <p className="text-lg text-gray-600">Redirecting...</p>
      <p className="text-sm text-gray-500 mt-2">
        If you're not redirected automatically, please check the QR code validity.
      </p>
    </div>
  );
} 