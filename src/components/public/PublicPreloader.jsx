import React, { useState, useEffect, useRef } from 'react';

/**
 * PublicPreloader
 * Layar putih dengan teks hitam sesuai font terpilih (Inter).
 * Animasi huruf dari kiri ke kanan sebagai loading, lalu bertransisi ke beranda.
 */
const WORDS = ['DPM', 'Fasilkom', 'Universitas', 'Mercu', 'Buana'];

export default function PublicPreloader() {
  const [shouldRender, setShouldRender] = useState(true);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'completed' | 'exit' | 'done'
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const originalOverflowRef = useRef('');

  // Hitung total karakter untuk kalkulasi progress
  const totalChars = WORDS.reduce((acc, word) => acc + word.length, 0);

  useEffect(() => {
    originalOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Animasi huruf berjalan dari kiri ke kanan
    let currentIndex = 0;
    const charInterval = setInterval(() => {
      currentIndex += 1;
      setActiveCharIndex(currentIndex);

      if (currentIndex >= totalChars) {
        clearInterval(charInterval);
        setPhase('completed');

        // Jeda sejenak setelah seluruh huruf menyala sebelum transisi ke beranda
        const tExit = setTimeout(() => {
          setPhase('exit');
        }, 350);

        // Selesai dan unmount layar preloader
        const tDone = setTimeout(() => {
          setPhase('done');
          setShouldRender(false);
          document.body.style.overflow = originalOverflowRef.current;
        }, 1050);

        return () => {
          clearTimeout(tExit);
          clearTimeout(tDone);
        };
      }
    }, 42); // 42ms per huruf (~1.3 detik total animasi)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        finishImmediately();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(charInterval);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflowRef.current;
    };
  }, [totalChars]);

  const finishImmediately = () => {
    setPhase('done');
    setShouldRender(false);
    document.body.style.overflow = originalOverflowRef.current;
  };

  if (!shouldRender || phase === 'done') return null;

  const isExiting = phase === 'exit';

  // Helper untuk menentukan index global tiap karakter
  let charCounter = -1;

  return (
    <div
      aria-hidden="true"
      onClick={finishImmediately}
      style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-950 cursor-pointer select-none transition-all duration-700 ${
        isExiting ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-4xl w-full text-center">
        {/* Kontainer Kalimat Tipografi */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 gap-y-1.5 text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          {WORDS.map((word, wIdx) => (
            <span key={wIdx} className="inline-flex whitespace-nowrap">
              {word.split('').map((char, cIdx) => {
                charCounter += 1;
                const isLit = charCounter <= activeCharIndex;
                const isCurrent = charCounter === activeCharIndex;

                return (
                  <span
                    key={cIdx}
                    className={`inline-block transition-all duration-200 ${
                      isLit
                        ? 'text-slate-950 font-black opacity-100 scale-100'
                        : 'text-slate-300 font-semibold opacity-35 scale-95'
                    } ${isCurrent ? '-translate-y-0.5' : 'translate-y-0'}`}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </div>

        {/* Garis Aksen Halus Loading di Bawah Teks */}
        <div className="w-36 sm:w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden mt-8">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${Math.min(
                100,
                Math.round(((activeCharIndex + 1) / totalChars) * 100)
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
