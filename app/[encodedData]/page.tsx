// pages/[encodedData]/page.tsx
"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";

interface Exam {
  name: string;
  date: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateCountdown = (date: Date): Countdown => {
  const now = new Date();
  const distance = date.getTime() - now.getTime();

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % 1000) / 1000);

  return { days, hours, minutes, seconds };
};

const CountdownPage = () => {
  const searchParams = useSearchParams();
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const encodedData = window.location.pathname.slice(1); // Extracting the encoded data from the URL
    if (encodedData) {
      const decodedData = decodeURIComponent(encodedData);
      setExams(JSON.parse(decodedData));
    }
  }, [searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white bg-gray-600">
      <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gray-500 bg-opacity-20 backdrop-blur-lg drop-shadow-lg w-full max-w-4xl">
        {exams.map((exam, index) => {
          const countdown = calculateCountdown(new Date(exam.date));
          return (
            <div key={index} className="mb-16 text-center w-full">
              <h2 className="mb-5 text-2xl font-semibold">{exam.name}</h2>
              <div className="flex flex-wrap items-center justify-center w-full gap-4">
                <div className="timer">
                  <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                    <h3 className="font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">{countdown.days}</h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">Days</p>
                  </div>
                </div>
                <div className="timer">
                  <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                    <h3 className="font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">{countdown.hours}</h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">Hours</p>
                  </div>
                </div>
                <div className="timer">
                  <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                    <h3 className="font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">{countdown.minutes}</h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">Minutes</p>
                  </div>
                </div>
                <div className="timer">
                  <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                    <h3 className="font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">{countdown.seconds}</h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">Seconds</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default CountdownPage;
