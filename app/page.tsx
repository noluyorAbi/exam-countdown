"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from 'react-modal';
import clsx from "clsx";
import Link from "next/link";

interface Countdown {
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

// Set the app element for react-modal to the body element
Modal.setAppElement('body');

export default function Home() {
  const [Countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [newCountdown, setNewCountdown] = useState({ name: "", date: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const countdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateCountdowns = () => {
      Countdowns.forEach((Countdown, index) => {
        const date = new Date(Countdown.date);
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
  }, [Countdowns]);

  const handleAddCountdown = () => {
    setCountdowns([...Countdowns, newCountdown]);
    setNewCountdown({ name: "", date: "" });
  };

  const handleDeleteCountdown = (index: number) => {
    setCountdowns(Countdowns.filter((_, i) => i !== index));
  };

  const generateUrl = () => {
    const encodedData = encodeURIComponent(JSON.stringify(Countdowns));
    const url = `${window.location.origin}/${encodedData}`;
    setGeneratedUrl(url);
    setModalIsOpen(true);
    setCopied(false); // Reset the copied state when the modal opens
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
  };

  const handleDateInputClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Sort Countdowns by date
  const sortedCountdowns = Countdowns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white bg-gray-600">
      <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gray-500 bg-opacity-20 backdrop-blur-lg drop-shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to the Countdown App!</h1>
        <p className="mb-8 text-center text-gray-800">
          Add your exams and see the countdown to each one. Dates will be highlighted:
          <span className="text-white font-bold "> white</span> for upcoming dates,
          <span className="text-red-500 "> red</span> when they are less than 4 weeks away, and
          <span className="text-red-500 animate-pulse"> pulsing red</span> when they are less than 2 weeks away.
          Use the generated URL to share your countdowns or set it as a background on macOS using the <Link href={"https://github.com/sindresorhus/Plash"} className="text-blue-500 hover:text-blue-800">Plash</Link> app.
        </p>
        <form className="w-full mb-8 flex flex-col items-center" onSubmit={(e) => { e.preventDefault(); handleAddCountdown(); }}>
          <input
            type="text"
            placeholder="Countdown Name"
            className="mb-4 p-2 rounded-md bg-gray-700 text-white"
            value={newCountdown.name}
            onChange={(e) => setNewCountdown({ ...newCountdown, name: e.target.value })}
          />
          <div className="mb-4 p-2 rounded-md bg-gray-700 text-white cursor-pointer" onClick={handleDateInputClick}>
            <input
              type="datetime-local"
              className="bg-transparent text-white w-full focus:outline-none cursor-pointer"
              value={newCountdown.date}
              onChange={(e) => setNewCountdown({ ...newCountdown, date: e.target.value })}
              ref={dateInputRef}
            />
          </div>
          <button type="submit" className="mb-4 p-3 rounded-md bg-green-500 text-white">
            Add Countdown
          </button>
        </form>
        <button onClick={generateUrl} className="p-3 rounded-md bg-blue-500 text-white mb-10">
          Generate URL
        </button>
        {sortedCountdowns.map((Countdown, index) => {
          const timeLeft = new Date(Countdown.date).getTime() - new Date().getTime();
          const isLessThan4Weeks = timeLeft <= 4 * 7 * 24 * 60 * 60 * 1000;
          const isLessThan2Weeks = timeLeft <= 2 * 7 * 24 * 60 * 60 * 1000;

          const textClass = clsx({
            "text-red-500": isLessThan4Weeks,
            "animate-pulse": isLessThan2Weeks,
          });

          return (
            <div
              key={index}
              className="mb-16 text-center w-full flex items-center"
              ref={(el) => {
                countdownRefs.current[index] = el;
              }}
            >
              <div className="flex flex-col items-center justify-center w-full gap-4">
                <h2 className={`mb-5 text-2xl font-semibold ${textClass}`}>
                  {Countdown.name}
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
              <button onClick={() => handleDeleteCountdown(index)} className="ml-4 mt-4 p-2 rounded-md bg-red-500 text-white">
                Delete Countdown
              </button>
            </div>
          );
        })}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Generated URL"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-xl mb-4">Generated URL</h2>
        <input
          type="text"
          value={generatedUrl}
          readOnly
          className="w-full p-2 mb-4 rounded-md bg-gray-200 text-gray-700"
        />
        <button
          onClick={copyToClipboard}
          className={`p-2 rounded-md text-white ${copied ? 'bg-green-500' : 'bg-blue-500'}`}
        >
          {copied ? 'Successfully Copied ✓' : 'Copy to Clipboard'}
        </button>
        <button onClick={() => setModalIsOpen(false)} className="p-2 rounded-md bg-red-500 text-white ml-2">
          Close
        </button>
      </Modal>
    </main>
  );
}
