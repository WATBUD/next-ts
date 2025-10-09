import GoogleAd from "@/components/google_ad";
import GoogleAdPC from "@/components/google_ad_pc";
import Script from 'next/script';
import { useIsMobile } from '../../common/shared-function';

interface AdLayoutProps {
  children: React.ReactNode;
}

const AD_CLIENT = "ca-pub-5036448216533";

export default function AdLayout({ children }: AdLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      
      {/* Bottom Ad */}
      <div
        style={{
          position: "fixed",
          display: "flex",
          backgroundColor: "#0000",
          zIndex: 9999,
          overflow: "hidden",
          marginTop: "90vh",
          justifyContent: "center",
          alignItems: "center",
          width: "100%"
        }}
      >
        <div>
          <GoogleAd
            isMobile={isMobile}
            adClient={AD_CLIENT}
            adStyle={{
              width: "1200px",
              height: "50px",
              maxWidth: '680px',
            }}
            adSlot="1239843369"
          />
        </div>
      </div>

      {/* Left Sidebar Ad - Desktop Only */}
      {!isMobile && (
        <GoogleAdPC
          adClient={AD_CLIENT}
          adStyle={{
            position: "fixed",
            backgroundColor: "#0000",
            zIndex: 9999,
            left: "0",
            width: "120px",
            height: "1200px",
            maxHeight: "100%",
          }}
          adSlot="2939969664"
        />
      )}

      {/* Right Sidebar Ad - Desktop Only */}
      {!isMobile && (
        <GoogleAdPC
          adClient={AD_CLIENT}
          adStyle={{
            position: "fixed",
            backgroundColor: "#0000",
            zIndex: 9999,
            right: "20",
            width: "120px",
            height: "1200px",
            maxHeight: "100%",
          }}
          adSlot="8132887911"
        />
      )}

      {children}
    </>
  );
}
