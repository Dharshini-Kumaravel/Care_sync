import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 2.2 seconds display, then trigger fadeout transition, then navigate
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`splash ${fadeOut ? 'splash--fade-out' : ''}`}>
      <div className="splash__content animate-scale-in">
        <div className="splash__logo">
          <div className="splash__logo-icon animate-pulse-dot">
            <Activity size={36} color="#fff" />
          </div>
        </div>
        <h1 className="splash__name animate-fade-in-up">CareSync AI</h1>
        <p className="splash__tagline animate-fade-in-up delay-1">Hospital Response Intelligence Platform</p>
        
        {/* Modern soft clinical status loader */}
        <div className="splash__loader-wrap animate-fade-in-up delay-2">
          <div className="splash__loader" />
          <span>Calibrating monitoring feeds...</span>
        </div>
        
        <div className="splash__footer animate-fade-in delay-3">
          SECURE EHR INTERFACE · Apollo & Fortis-Class Roster
        </div>
      </div>
    </div>
  );
}
