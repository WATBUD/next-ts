"use client";

import { useEffect } from 'react';
import { parseGIF, decompressFrames } from 'gifuct-js';

const AnimatedFavicon = () => {
  useEffect(() => {
    const loadAndAnimateFavicon = async () => {
      try {
        const response = await fetch('/Boli.gif');
        const arrayBuffer = await response.arrayBuffer();
        const gif = parseGIF(arrayBuffer);
        const frames = decompressFrames(gif, true);
        let currentFrame = 0;
        const updateFavicon = () => {
          const frame = frames[currentFrame];
          const canvas = document.createElement('canvas');
          canvas.width = gif.lsd.width;
          canvas.height = gif.lsd.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
            imageData.data.set(frame.patch);
            ctx.putImageData(imageData, frame.dims.left, frame.dims.top);
          }
          const link:any =
            document.querySelector("link[rel~='icon']") || document.createElement('link');
          link.rel = 'icon';
          link.href = canvas.toDataURL();
          document.head.appendChild(link);

          currentFrame = (currentFrame + 1) % frames.length;
        };

        const interval = setInterval(updateFavicon, 1); // 每幀間隔 100ms（根據需要調整）
        return () => clearInterval(interval); // 組件卸載時清理定時器
      } catch (error) {
        console.error('Failed to load or parse GIF:', error);
      }
    };

    loadAndAnimateFavicon();
  }, []);

  return null;
};

export default AnimatedFavicon;
