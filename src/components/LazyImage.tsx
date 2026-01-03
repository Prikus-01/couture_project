import { useEffect, useRef, useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function LazyImage({ src, alt, className = '', ...rest }: LazyImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              io.disconnect();
            }
          });
        },
        { rootMargin: '200px' }
      );
      io.observe(containerRef.current);

      return () => io.disconnect();
    }

    // Fallback if IO not supported
    setShouldLoad(true);
  }, [src]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${!loaded ? 'bg-gray-100' : ''}`}>
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" aria-hidden />
      )}

      {/* Image (only set src when we want to load) */}
      {shouldLoad && !error && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          {...rest}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-[#a5b8cc]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
    </div>
  );
}
