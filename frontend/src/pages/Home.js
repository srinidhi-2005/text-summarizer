import { useAuth } from "../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ModernFileUpload from "../components/ModernFileUpload";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const summaryRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("newchat")) {
      setInputText("");
      setFile(null);
      setSummary("");
      setError("");
      window.history.replaceState({}, document.title, "/home");
    }
  }, [location.search]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f6]">
        <h2 className="text-3xl font-bold mb-6 text-[#800000]">Please log in to use Text Summarizer</h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#800000] text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-[#990909] transition"
        >
          Login
        </button>
      </div>
    );
  }

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setInputText("");
    setSummary("");
    setError("");
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setFile(null);
    setSummary("");
    setError("");
  };

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      let res, data;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData
        });
      } else if (inputText.trim()) {
        const blob = new Blob([inputText], { type: "text/plain" });
        const formData = new FormData();
        formData.append("file", blob, "input.txt");
        res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData
        });
      } else {
        setError("Please upload a file or enter some text.");
        setLoading(false);
        return;
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to summarize");
      setSummary(data.summary);
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const handleListen = () => {
    if (!summary) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(summary);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden bg-[#f9f5f5]">
      <div className="absolute top-0 left-0 w-full z-30">
        <Navbar />
      </div>
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen w-full pt-32 pb-12">
        <div className="flex w-full max-w-7xl mx-auto gap-8 mt-8">
          <div className="flex flex-[3] gap-8">
            <div className="flex-1 bg-white/90 rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-xl backdrop-blur-md">
              <h2 className="text-2xl font-bold mb-4 text-[#800000]">Summarize Document or Text</h2>
              <ModernFileUpload onFileSelect={handleFileSelect} />
              
              <div className="mb-4 text-center text-gray-500"></div>
              <textarea
                value={inputText}
                onChange={handleTextChange}
                placeholder="Paste or type your text here..."
                className="w-full border border-gray-300 rounded p-3 min-h-[120px] focus:ring-2 focus:ring-[#800000] outline-none mb-4"
              />
              <button
                onClick={handleSummarize}
                className="w-full bg-[#800000] hover:bg-[#990909] text-white font-semibold py-3 rounded-lg transition text-lg mb-3"
                disabled={loading}
              >
                {loading ? "Summarizing..." : "Summarize"}
              </button>
              {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
            </div>
            <div className="flex-1 bg-white/90 rounded-2xl shadow-2xl p-8 min-w-[400px] max-w-xl backdrop-blur-md flex flex-col" ref={summaryRef}>
              <h2 className="text-2xl font-bold mb-4 text-[#800000]">Summary Output</h2>
              {summary ? (
                <>
                  <div className="mb-7 whitespace-pre-line break-words text-gray-800 bg-gray-100 rounded p-3 max-h-64 overflow-y-auto">{summary}</div>
                  <div className="flex gap-16 mt-7 mb-7 relative">
                    <button onClick={handleDownload} className="bg-[#800000] text-white px-4 py-2 rounded hover:bg-[#990909]">Download</button>
                    <button onClick={handleCopy} className="bg-gray-200 text-[#800000] px-4 py-2 rounded hover:bg-gray-300">Copy</button>
                    <button 
                      onClick={handleListen} 
                      className={`px-4 py-2 rounded transition ${
                        isSpeaking 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isSpeaking ? 'Stop' : 'Listen'}
                    </button>
                    {copied && (
                      <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-black text-white px-4 py-2 rounded shadow-lg text-sm animate-fade-in-out z-50">
                        Copied!
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-400 italic">No summary yet. Upload a document or enter text to summarize.</div>
              )}
            </div>
          </div>
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default Home;