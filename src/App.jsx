import { useEffect, useRef, useState } from "react";
import "./App.css";
import { URL } from "./constants";
import RecentSearch from "./component/RecentSearch";
import QuestionAnswer from "./component/QuestionAnswer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || [],
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const [loader, setLoader] = useState(false);

  const scrollToAns = useRef();

  console.log("API KEY:", import.meta.env.VITE_GEMINI_API_KEY);
  console.log("URL:", URL);

  const askQuestion = async () => {
    if (!question && !selectedHistory) return;

    try {
      if (question) {
        let history = JSON.parse(localStorage.getItem("history")) || [];

        history = [question, ...history];
        history = [...new Set(history)];
        history = history.slice(0, 20);

        history = history.map(
          (item) => item.charAt(0).toUpperCase() + item.slice(1).trim(),
        );

        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      }

      const payloadData = question || selectedHistory;

      const payload = {
        contents: [
          {
            parts: [{ text: payloadData }],
          },
        ],
      };

      setLoader(true);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Response:", data);

      if (!response.ok) {
        alert(data.error?.message || "Something went wrong");
        setLoader(false);
        return;
      }

      if (!data.candidates) {
        alert("No response received from Gemini API.");
        setLoader(false);
        return;
      }

      let dataString = data.candidates[0].content.parts[0].text;

      dataString = dataString
        .split("* ")
        .map((item) => item.trim())
        .filter(Boolean);

      setResult((prev) => [
        ...prev,
        {
          type: "q",
          text: payloadData,
        },
        {
          type: "a",
          text: dataString,
        },
      ]);

      setQuestion("");

      setTimeout(() => {
        if (scrollToAns.current) {
          scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
        }
      }, 300);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoader(false);
    }
  };

  const isEnter = (event) => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  useEffect(() => {
    if (selectedHistory) {
      askQuestion();
    }
  }, [selectedHistory]);

  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <RecentSearch
        recentHistory={recentHistory}
        setRecentHistory={setRecentHistory}
        setSelectedHistory={setSelectedHistory}
      />

      <div className="col-span-4 p-10">
        <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
          Hello User, Ask me anything
        </h1>

        {loader && (
          <div className="mt-5">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"
              role="status"
            />
          </div>
        )}

        <div
          ref={scrollToAns}
          className="container h-110 overflow-scroll no-scrollbar mt-5"
        >
          <ul className="text-zinc-300">
            {result.map((item, index) => (
              <QuestionAnswer key={index} item={item} index={index} />
            ))}
          </ul>
        </div>

        <div className="bg-zinc-700 w-1/2 p-1 text-white m-auto rounded-4xl border border-zinc-700 flex h-16 mt-5">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={isEnter}
            className="w-full h-full p-3 outline-none bg-transparent"
            placeholder="Ask me anything..."
          />

          <button
            onClick={askQuestion}
            className="px-5 cursor-pointer hover:text-purple-300"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
