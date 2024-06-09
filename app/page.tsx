"use client";
import { useEffect, useState } from "react";

// Array with exam dates and times
const examDates = [
  { name: "Bayes Statistik", date: "23.07.2024 10:00:00" },
  { name: "RNVS Exam", date: "26.07.2024 12:00:00" },
  { name: "BachelorSem", date: "28.06.2024 17:00:00" },
];

// Convert dates to JavaScript Date objects
const parseDate = (dateString) => {
  const [day, month, yearAndTime] = dateString.split(".");
  const [year, time] = yearAndTime.split(" ");
  return new Date(`${year}-${month}-${day}T${time}`);
};

export default function Home() {
  const [countdowns, setCountdowns] = useState(
    examDates.map(() => ({ days: 0, hours: 0, minutes: 0, seconds: 0 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns(
        examDates
          .map(({ date }) => parseDate(date))
          .map((date) => {
            const now = new Date();
            const distance = date - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            return { days, hours, minutes, seconds };
          })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sort exams by date
  const sortedExams = examDates
    .map((exam, index) => ({ ...exam, countdown: countdowns[index] }))
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 md:p-16 lg:p-24 bg-gray-900 text-gray-100">
      {sortedExams.map((exam, index) => (
        <div key={index} className="mb-16 text-center w-full max-w-4xl">
          <h2 className="mb-5 text-2xl font-semibold">{exam.name}</h2>
          <div className="flex flex-wrap items-center justify-center w-full gap-4">
            <div className="timer">
              <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                <h3 className="countdown-element days font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-white text-center">
                  {exam.countdown.days}
                </h3>
                <p className="text-xs sm:text-sm md:text-lg uppercase font-normal text-white mt-1 text-center w-full">
                  Days
                </p>
              </div>
            </div>

            <div className="timer">
              <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                <h3 className="countdown-element hours font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-white text-center">
                  {exam.countdown.hours}
                </h3>
                <p className="text-xs sm:text-sm md:text-lg uppercase font-normal text-white mt-1 text-center w-full">
                  Hours
                </p>
              </div>
            </div>

            <div className="timer">
              <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                <h3 className="countdown-element minutes font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-white text-center">
                  {exam.countdown.minutes}
                </h3>
                <p className="text-xs sm:text-sm md:text-lg uppercase font-normal text-white mt-1 text-center w-full">
                  Minutes
                </p>
              </div>
            </div>

            <div className="timer">
              <div className="rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                <h3 className="countdown-element seconds font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-white text-center">
                  {exam.countdown.seconds}
                </h3>
                <p className="text-xs sm:text-sm md:text-lg uppercase font-normal text-white mt-1 text-center w-full">
                  Seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}