// pages/[encodedData]/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation';
import clsx from "clsx";

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

// Calculate countdown
const calculateCountdown = (date: Date): Countdown => {
  const now = new Date();
  const distance = date.getTime() - now.getTime();

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const CountdownPage = () => {
  const searchParams = useSearchParams();
  const countdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const encodedData = window.location.pathname.slice(1); // Extracting the encoded data from the URL
    if (encodedData) {
      const decodedData = decodeURIComponent(encodedData);
      setExams(JSON.parse(decodedData));
    }
  }, [searchParams]);

  useEffect(() => {
    const updateCountdowns = () => {
      exams.forEach((exam, index) => {
        const date = new Date(exam.date);
        const countdown = calculateCountdown(date);

        const countdownElement = countdownRefs.current[index];
        if (countdownElement) {
          const days = countdownElement.querySelector('.days');
          const hours = countdownElement.querySelector('.hours');
          const minutes = countdownElement.querySelector('.minutes');
          const seconds = countdownElement.querySelector('.seconds');

          if (days) days.textContent = countdown.days.toString();
          if (hours) hours.textContent = countdown.hours.toString();
          if (minutes) minutes.textContent = countdown.minutes.toString();
          if (seconds) seconds.textContent = countdown.seconds.toString();
        }
      });

      requestAnimationFrame(updateCountdowns);
    };

    const animationFrameId = requestAnimationFrame(updateCountdowns);

    return () => cancelAnimationFrame(animationFrameId);
  }, [exams]);

  // Sort exams by date
  const sortedExams = exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white bg-gray-600">
      <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gray-500 bg-opacity-20 backdrop-blur-lg drop-shadow-lg">
        {sortedExams.map((exam, index) => {
          const timeLeft = new Date(exam.date).getTime() - new Date().getTime();
          const isLessThan4Weeks = timeLeft <= 4 * 7 * 24 * 60 * 60 * 1000;
          const isLessThan2Weeks = timeLeft <= 2 * 7 * 24 * 60 * 60 * 1000;

          const textClass = clsx({
            "text-red-500": isLessThan4Weeks,
            "animate-pulse": isLessThan2Weeks,
          });

          return (
            <div
              key={index}
              className="mb-16 text-center w-full max-w-4xl"
              ref={(el) => {
                countdownRefs.current[index] = el;
              }}
            >
              <h2 className={`mb-5 text-2xl font-semibold ${textClass}`}>
                {exam.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center w-full gap-4">
                <div className="timer">
                  <div className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}>
                    <h3 className="countdown-element days font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                      0
                    </h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                      Days
                    </p>
                  </div>
                </div>

                <div className="timer">
                  <div className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}>
                    <h3 className="countdown-element hours font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                      0
                    </h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                      Hours
                    </p>
                  </div>
                </div>

                <div className="timer">
                  <div className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}>
                    <h3 className="countdown-element minutes font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                      0
                    </h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                      Minutes
                    </p>
                  </div>
                </div>

                <div className="timer">
                  <div className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}>
                    <h3 className="countdown-element seconds font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                      0
                    </h3>
                    <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                      Seconds
                    </p>
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
