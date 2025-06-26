/* eslint-disable react-hooks/exhaustive-deps */

// "use client"
import { useEffect, useState } from 'react';
import toast, { Renderable, Toast, Toaster, ValueFunction } from 'react-hot-toast';
export const showCustomToast = (text: string) => {
  toast(text, {
    duration: 900,
    position: 'top-center',
    //style: { textAlign: 'center' },
    className: '',
    // Custom Icon
    icon: '❤️',
  
    // Change colors of success/error/loading icon
    iconTheme: {
      primary: '#000',
      secondary: '#fff',
    },
  
    // Aria
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
};
export function translateTextAndSpeak(text: string='',speed: number=1,volume: number=1) {
  const utterance_input = new SpeechSynthesisUtterance(text);
  //const utterance_input = new SpeechSynthesisUtterance(`You pressed ${text}`);
  //utterance_input.lang = "en-US";
  utterance_input.volume = volume;
  utterance_input.rate = speed;
  //const synth = window.speechSynthesis;
  let voices = speechSynthesis.getVoices();
  const enVoices = voices.filter((v) => v.lang.toLowerCase().includes("en"));

  console.log(
    "%c translateTextAndSpeak",
    "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
    "text",
    text,
    "speed",
    speed,
    "enVoices",
    enVoices
  );

  if (enVoices.length > 0) {
    const randomVoice = enVoices[Math.floor(Math.random() * enVoices.length)];
    console.log(
      "%c translateTextAndSpeak+randomVoice",
      "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
      "randomVoice",
      randomVoice
    );
  
    utterance_input.voice = randomVoice;
  }

  //console.log(`voices ${JSON.stringify(voices)}`);
  console.dir(voices);
  if(speechSynthesis.speaking)
  speechSynthesis.cancel();

  speechSynthesis.speak(utterance_input);
}

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 1240px)').matches);
    };

    checkMobile(); // 初次檢查
    window.addEventListener('resize', checkMobile); // 監聽視窗大小變化

    return () => {
      window.removeEventListener('resize', checkMobile); // 清理監聽器
    };
  }, []);

  console.log(
    "%c sharedFunction useIsMobile",
    "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
    "isMobile",
    isMobile
  );
  return isMobile;
};

export const highlightText = (text: string, query: string) => {
  if (!query) return text; 
  const parts = text.split(new RegExp(`(${query})`, "gi")); 
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "#ff0" }}>{part}</span> 
    ) : part
  );
};


export function downloadJSONFile(filename: string, data: object) {
  // Convert data to a JSON string
  const jsonString = JSON.stringify(data, null, 2);

  // Create a Blob object
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;

  // Simulate a click to download the file
  document.body.appendChild(link);
  link.click();

  // Clean up the DOM
  document.body.removeChild(link);
}

export const handleScroll = () => {
  //document.title = "language-practice-tool";
  const _handleScroll = () => {
      const mainScreenUI = document.getElementById("MainScreenUI");
      const scrollToTopButton = document.getElementById("scrollToTopButton");
      if (mainScreenUI && scrollToTopButton) {
        // console.log(
        //   "%c handleScroll",
        //   "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
        //   "mainScreenUI.scrollTop:",
        //   mainScreenUI.scrollTop
        // );
        if (scrollToTopButton) {
          if (mainScreenUI.scrollTop > 200) {
            scrollToTopButton.style.display = "flex";
          } else {
            scrollToTopButton.style.display = "none";
          }
        }
      }
    };

    const mainScreenUI = document.getElementById('MainScreenUI');
    if (mainScreenUI) {
      mainScreenUI.addEventListener('scroll', _handleScroll);

      return () => {
        mainScreenUI.removeEventListener('scroll', handleScroll);
      };
    }
};

export const copyText = (
  textAbove: string,
  textBelow: string,
  configOptions: any
) => {
  const text =
    !configOptions.copyTheTextAbove && !configOptions.copyTheTextBelow
      ? 'No copy conditions selected\n(未選擇複製條件)'
      : configOptions.copyTheTextAbove && configOptions.copyTheTextBelow
      ? textAbove + "\n" + textBelow
      : configOptions.copyTheTextBelow
      ? textBelow
      : configOptions.copyTheTextAbove
      ? textAbove
      : 'No copy conditions selected';

  if (text.includes('未選擇複製條件')) {
    showCustomToast(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showCustomToast(text);
    showCustomToast("Copied");
  }
};

export const scrollToTop = () => {

  const mainScreenUI = document.getElementById("MainScreenUI");

  if(mainScreenUI){
    const scrollDuration = 300;
    const scrollStep = -mainScreenUI.scrollTop / (scrollDuration / 15);

    const scrollInterval = setInterval(() => {
      if (mainScreenUI.scrollTop !== 0) {
        mainScreenUI.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval); 
      }
    }, 15);
  }

};
