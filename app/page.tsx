"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import clsx from "clsx";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

interface Countdown {
  name: string;
  date: string;
}

interface CountdownTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isDone: boolean;
}

// Calculate countdown
const calculateCountdown = (date: Date): CountdownTimer => {
  const now = new Date();
  const distance = date.getTime() - now.getTime();

  const isDone = distance < 0;

  let absDistance = Math.abs(distance);

  const days = Math.floor(absDistance / (1000 * 60 * 60 * 24));
  absDistance -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(absDistance / (1000 * 60 * 60));
  absDistance -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(absDistance / (1000 * 60));
  absDistance -= minutes * (1000 * 60);

  const seconds = Math.floor(absDistance / 1000);

  return {
    days: isDone ? -days : days,
    hours: isDone ? -hours : hours,
    minutes: isDone ? -minutes : minutes,
    seconds: isDone ? -seconds : seconds,
    isDone,
  };
};

// Set the app element for react-modal to the body element
Modal.setAppElement("body");

export default function Home() {
  const [Countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [newCountdown, setNewCountdown] = useState({ name: "", date: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [parsedUrl, setParsedUrl] = useState<Countdown[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDate, setEditingDate] = useState<string>("");
  const [editingName, setEditingName] = useState<string>("");
  const [isUrlEdited, setIsUrlEdited] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [liveEditedUrl, setLiveEditedUrl] = useState("");
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
          const days = countdownElement.querySelector(".days");
          const hours = countdownElement.querySelector(".hours");
          const minutes = countdownElement.querySelector(".minutes");
          const seconds = countdownElement.querySelector(".seconds");

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

  useEffect(() => {
    if (isUrlEdited) {
      const encodedData = encodeURIComponent(JSON.stringify(parsedUrl));
      const url = `${window.location.origin}/${encodedData}`;
      setLiveEditedUrl(url);
    }
  }, [parsedUrl, isUrlEdited]);

  const handleAddCountdown = () => {
    setCountdowns([...Countdowns, newCountdown]);
    setNewCountdown({ name: "", date: "" });
  };

  const handleDeleteCountdown = (index: number) => {
    setCountdowns(Countdowns.filter((_, i) => i !== index));
  };

  const handleEditCountdown = (index: number) => {
    setEditingIndex(index);
    setEditingDate(Countdowns[index].date);
    setEditingName(Countdowns[index].name);
  };

  const handleSaveEditCountdown = (index: number) => {
    const updatedCountdowns = Countdowns.map((countdown, i) =>
      i === index
        ? { ...countdown, date: editingDate, name: editingName }
        : countdown
    );
    setCountdowns(updatedCountdowns);
    setEditingIndex(null);
    setEditingDate("");
    setEditingName("");
    setParsedUrl(updatedCountdowns);
    setIsUrlEdited(true);
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

  const copyEditedUrlToClipboard = () => {
    navigator.clipboard.writeText(liveEditedUrl);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 2000);
  };

  const handleDateInputClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
  };

  const parseCustomUrl = () => {
    try {
      const url = new URL(customUrl);
      const data = decodeURIComponent(url.pathname.slice(1));
      const parsedData = JSON.parse(data);
      setParsedUrl(parsedData);
      setCountdowns(parsedData);
      setIsUrlEdited(true);
    } catch (error) {
      console.error("Invalid URL format", error);
    }
  };

  // Sort Countdowns by date
  const sortedCountdowns = Countdowns.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white bg-gray-600">
        <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gray-500 bg-opacity-20 backdrop-blur-lg drop-shadow-lg w-full max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Welcome to the Countdown App!
          </h1>
          <p className="mb-8 text-center text-gray-800">
            I wrote this simple web app to make a custom counter for my Exams
            and display them on my MacBook screen with{" "}
            <Link
              href={"https://github.com/sindresorhus/Plash"}
              className="text-blue-500 hover:text-blue-800"
            >
              Plash
            </Link>
            . Instead of hardcoding the Countdown dates in my code, I wanted to
            make it usable by anyone. Add your Countdowns and see the countdown
            to each one.
          </p>
          <p className="mb-8 text-center text-gray-800">
            Dates will be highlighted:{" "}
            <span className="text-white font-bold px-2 bg-gray-400 ">
              white
            </span>{" "}
            for upcoming dates,
            <span className="text-red-500 "> red</span> when they are less than
            4 weeks away, and
            <span className="text-red-500 animate-pulse">
              {" "}
              pulsing red
            </span>{" "}
            when they are less than 2 weeks away. Use the generated URL to share
            your countdowns or set it as a background on macOS using the Plash
            app.
          </p>
          <form
            className="w-full mb-8 flex flex-col items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCountdown();
            }}
          >
            <input
              type="text"
              placeholder="Countdown Name"
              className="mb-4 p-2 rounded-md bg-gray-700 text-white"
              value={newCountdown.name}
              onChange={(e) =>
                setNewCountdown({ ...newCountdown, name: e.target.value })
              }
            />
            <div
              className="mb-4 p-2 rounded-md bg-gray-700 text-white cursor-pointer"
              onClick={handleDateInputClick}
            >
              <input
                type="datetime-local"
                className="bg-transparent text-white w-full focus:outline-none cursor-pointer"
                value={newCountdown.date}
                onChange={(e) =>
                  setNewCountdown({ ...newCountdown, date: e.target.value })
                }
                ref={dateInputRef}
              />
            </div>
            <button
              type="submit"
              className="mb-4 p-3 rounded-md bg-green-500 text-white hover:bg-green-700 transition-colors duration-300 ease-in-out"
            >
              Add Countdown
            </button>
          </form>
          <button
            onClick={generateUrl}
            className="p-3 rounded-md bg-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-700 text-white mb-10"
          >
            Generate URL
          </button>
          <div className="mb-8 w-full">
            <h2 className="text-xl mb-4 text-gray-800">Edit URL</h2>
            <input
              type="text"
              placeholder="Paste your custom URL here"
              value={customUrl}
              onChange={handleCustomUrlChange}
              className="w-full p-2 mb-4 rounded-md bg-gray-200 text-gray-700"
            />
            <button
              onClick={parseCustomUrl}
              className="p-2 rounded-md text-white mb-4 bg-blue-500 hover:bg-blue-700 transition-colors duration-300 ease-in-out"
            >
              Preview
            </button>

            {isUrlEdited && (
              <>
                <div className=" text-gray-700 p-4 rounded-md ">
                  <h3 className="text-lg mb-2">Edited URL:</h3>
                  <input
                    type="text"
                    value={liveEditedUrl}
                    readOnly
                    className="w-full p-2 mb-4 rounded-md bg-gray-200 text-gray-700"
                  />
                  <div className="flex items-center">
                    <button
                      onClick={copyEditedUrlToClipboard}
                      className="p-2 rounded-md text-white mt-4 bg-blue-500 hover:bg-blue-700 transition-colors duration-300 ease-in-out mr-4"
                    >
                      Copy Edited URL
                    </button>
                    <button
                      onClick={handleAddCountdown}
                      className="p-2 rounded-md text-white mt-4 bg-green-500 hover:bg-green-700 transition-colors duration-300 ease-in-out"
                    >
                      Add Countdown
                    </button>
                  </div>
                </div>
              </>
            )}
            {alertVisible && (
              <div className="p-2 mt-2 text-green-700 bg-green-100 border border-green-400 rounded">
                Saved to clipboard!
              </div>
            )}
          </div>
          {sortedCountdowns.map((Countdown, index) => {
            const date = new Date(Countdown.date);
            const countdown = calculateCountdown(date);
            const isLessThan4Weeks = countdown.isDone && countdown.days >= -28;
            const isLessThan2Weeks = countdown.isDone && countdown.days >= -14;

            const textClass = clsx({
              "text-red-500": !countdown.isDone && countdown.days <= 28,
              "animate-pulse": !countdown.isDone && countdown.days <= 14,
              "text-green-500": countdown.isDone,
            });

            return (
              <div
                key={index}
                className="mb-16 text-center w-full flex items-center justify-between"
                ref={(el) => {
                  countdownRefs.current[index] = el;
                }}
              >
                <div className="flex flex-col items-center justify-center w-full gap-4">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        className="p-2 mb-2 rounded-md bg-gray-700 text-white"
                        value={editingName}
                        placeholder="Countdown Name"
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                      <input
                        type="datetime-local"
                        className="p-2 mb-2 rounded-md bg-gray-700 text-white"
                        value={editingDate}
                        onChange={(e) => setEditingDate(e.target.value)}
                      />
                      <button
                        onClick={() => handleSaveEditCountdown(index)}
                        className="mb-2 p-2 rounded-md bg-green-500 text-white hover:bg-green-700 transition-colors duration-300 ease-in-out"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <h2
                        className={`mb-5 text-2xl font-semibold ${textClass}`}
                      >
                        {Countdown.name}
                      </h2>
                      <div className="flex flex-wrap items-center justify-center w-full gap-4">
                        <div className="timer">
                          <div
                            className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}
                          >
                            <h3 className="countdown-element days font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                              {countdown.days}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                              Days
                            </p>
                          </div>
                        </div>
                        <div className="timer">
                          <div
                            className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}
                          >
                            <h3 className="countdown-element hours font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                              {countdown.hours}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                              Hours
                            </p>
                          </div>
                        </div>
                        <div className="timer">
                          <div
                            className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}
                          >
                            <h3 className="countdown-element minutes font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                              {countdown.minutes}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                              Minutes
                            </p>
                          </div>
                        </div>
                        <div className="timer">
                          <div
                            className={`rounded-xl bg-black/25 backdrop-blur-sm py-3 min-w-[64px] sm:min-w-[80px] md:min-w-[96px] flex items-center justify-center flex-col gap-1 px-3 ${textClass}`}
                          >
                            <h3 className="countdown-element seconds font-manrope font-semibold text-lg sm:text-xl md:text-2xl text-center">
                              {countdown.seconds}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-lg uppercase font-normal mt-1 text-center w-full">
                              Seconds
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {editingIndex !== index && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleEditCountdown(index)}
                      className="ml-4 mt-4 p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-700 transition-colors duration-300 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCountdown(index)}
                      className="ml-4 mt-4 p-2 rounded-md bg-red-500 text-white hover:bg-red-700 transition-colors duration-300 ease-in-out"
                    >
                      Delete
                    </button>
                  </div>
                )}
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
            className={`p-2 rounded-md text-white ${
              copied ? "bg-green-500" : "bg-blue-500"
            } hover:${
              copied ? "bg-green-700" : "bg-blue-700"
            } transition-colors duration-300 ease-in-out`}
          >
            {copied ? "Successfully Copied ✓" : "Copy to Clipboard"}
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="p-2 rounded-md bg-red-500 text-white ml-2 hover:bg-red-700 transition-colors duration-300 ease-in-out"
          >
            Close
          </button>
        </Modal>
      </main>
      <footer className="flex bottom-0 sticky items-center justify-center p-4 bg-gray-700 text-white w-full">
        <span className="retro- cursor-default select-none">
          Created with <span className="hover:animate-pulse mx-1">❤️</span> by
          noluyor Abi
        </span>
        <a
          href="https://github.com/noluyorAbi"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2"
        >
          <FaGithub
            size={24}
            className="hover:scale-110 transition duration-150"
          />
        </a>
      </footer>
    </>
  );
}
