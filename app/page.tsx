"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Exam {
  name: string;
  date: string;
}

const calculateCountdown = (date: Date) => {
  const now = new Date();
  const distance = date.getTime() - now.getTime();

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % 1000) / 1000);

  return { days, hours, minutes, seconds };
};

export default function Home() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [newExam, setNewExam] = useState({ name: "", date: "" });
  const router = useRouter();

  const handleAddExam = () => {
    setExams([...exams, newExam]);
    setNewExam({ name: "", date: "" });
  };

  const generateUrl = () => {
    const encodedData = encodeURIComponent(JSON.stringify(exams));
    router.push(`/${encodedData}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white bg-gray-600">
      <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gray-500 bg-opacity-20 backdrop-blur-lg drop-shadow-lg w-full max-w-4xl">
        <form className="w-full mb-8 flex flex-col sm:flex-row justify-between items-center" onSubmit={(e) => { e.preventDefault(); handleAddExam(); }}>
          <input
            type="text"
            placeholder="Exam Name"
            className="mb-4 sm:mb-0 sm:mr-4 p-2 rounded-md bg-gray-700 text-white"
            value={newExam.name}
            onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
          />
          <input
            type="datetime-local"
            className="mb-4 sm:mb-0 sm:mr-4 p-2 rounded-md bg-gray-700 text-white"
            value={newExam.date}
            onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
          />
          <button type="submit" className="p-2 rounded-md bg-green-500 text-white">
            Add Exam
          </button>
        </form>
        <button onClick={generateUrl} className="p-2 rounded-md bg-blue-500 text-white">
          Generate URL
        </button>
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
}
