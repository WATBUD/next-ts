import { useEffect, useState } from 'react';
import Script from 'next/script';

type GoogleAdProps = {
  adClient: string;
  adSlot: string;
  adStyle?: React.CSSProperties;
  isMobile:boolean;
};
// import {useIsMobile} from '../app/common/sharedFunction';

const GoogleAd: React.FC<GoogleAdProps> = ({ isMobile,adClient, adSlot, adStyle }) => {
  const [isAdVisible, setIsAdVisible] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight * 0.05); 
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const adContainer = document.querySelector('.adsbygoogle');
    if (!adContainer || adContainer.hasAttribute('data-adsbygoogle-status')) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense initialization error:', e);
    }
    
    const observer = new MutationObserver(() => {
      const status = adContainer.getAttribute('data-adsbygoogle-status');
      
      if (status === 'done') {
        setIsAdVisible(true);
        // const adContainers = document.querySelectorAll('.adsbygoogle') as NodeListOf<HTMLElement>;

        // adContainers.forEach((adContainer) => {
        //   adContainer.style.height = 'auto';
        //   adContainer.style.maxHeight = '45px';
        // });
        observer.disconnect(); // Stop observing after the ad has been successfully loaded
      }
      setTimeout(() => {
        setHeight(window.innerHeight * 0.05); 
      }, 100);
    });
    
    observer.observe(adContainer, { attributes: true, attributeFilter: ['data-adsbygoogle-status'] });
    
    // Return cleanup function
    return () => {
      observer.disconnect();
    };
    
  }, []);

  return (
    <>
        <ins
          className="adsbygoogle max-w-[980px] w-[100%]" 
          //mr-[0.8vw]
          style={{
            // position: 'fixed',
            // zIndex: 9999,
            display: 'inline-block',
            overflow: 'hidden',
            //width: '45vw',
            // width: '100%',
            //height: '100%',
            marginRight:  isMobile ? "0" : "0.8vw",
            // height: isAdVisible?height:'0px', 
            // maxHeight: "50px", 
            // //maxWidth: '980px',
            backgroundColor: '#0000', 
            ...adStyle,
          }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      {/* {!isAdVisible && <div className='text-center'>No Ads Available</div>} */}
    </>
  );
};

export default GoogleAd;
