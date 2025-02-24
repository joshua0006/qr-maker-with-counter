import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, updateDoc, increment, getDoc } from './firebase';

export function RedirectPage() {
  const { qrId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const trackScan = async () => {
      if (qrId) {
        const qrDoc = doc(db, 'qrcodes', qrId);
        await updateDoc(qrDoc, {
          scanCount: increment(1)
        });
        
        const docSnap = await getDoc(qrDoc);
        if (docSnap.exists()) {
          window.location.href = docSnap.data().url;
        }
      }
    };

    trackScan();
  }, [qrId, navigate]);

  return (
    <div className="text-center p-8">
      <p className="text-lg text-gray-600">Redirecting...</p>
    </div>
  );
} 