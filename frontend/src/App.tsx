import React, { useState, useRef } from 'react';
import { BookOpen, Upload, Brain, GraduationCap, Loader2, FileText, CheckCircle } from 'lucide-react';
import { uploadPDF, fetchQuiz } from './api';
import ChatBox from './components/ChatBox';
import QuizCard from './components/QuizCard';

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await uploadPDF(file);
      setIsUploaded(true);
    } catch (err) {
      alert("Upload failed. Check if backend is running on port 8001.");
    } finally {
      setLoading(false);
    }
  };

  const startDeepDive = async () => {
    setLoading(true);
    try {
      const quiz = await fetchQuiz();
      setQuizData(quiz);
    } catch (err) {
      alert("Could not generate quiz. Try asking a chat question first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans text-slate-900">
      {/* Header Area */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              Community <span className="text-indigo-600">Copilot</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              AI Study Agent for Course Materials
            </p>
          </div>
        </div>
        <div className="hidden md:block h-px flex-1 mx-8 bg-slate-200" />
        <span className="text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200">
          V1.0 Stable
        </span>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Panel: Knowledge Management */}
        <div className="lg:col-span-4 space-y-6">
          {!isUploaded ? (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700">
                <BookOpen size={20} className="text-indigo-600" />
                Knowledge Source
              </h2>

              {/* Custom File Picker Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 mb-6 text-center cursor-pointer transition-all
                                    ${file ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'}
                                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf"
                />
                {file ? (
                  <div className="space-y-2">
                    <CheckCircle className="mx-auto text-green-500" size={32} />
                    <p className="text-sm font-bold text-green-700 truncate">{file.name}</p>
                    <p className="text-[10px] text-green-600">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto text-slate-300" size={32} />
                    <p className="text-sm font-semibold text-slate-500">Click to upload Course PDF</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Max size 10MB</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex justify-center items-center gap-3 hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-indigo-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><FileText size={18} /> Ingest Knowledge</>}
              </button>
            </div>
          ) : (
            <div className="bg-indigo-950 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Brain className="text-indigo-300" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready to Learn!</h2>
                  <p className="text-indigo-300 text-sm leading-relaxed">
                    The AI has vectorized your course material and is ready to assist.
                  </p>
                </div>
                <button
                  onClick={startDeepDive}
                  disabled={loading}
                  className="w-full bg-white text-indigo-950 py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 flex justify-center items-center gap-2 transition-transform active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "START DEEP DIVE QUIZ"}
                </button>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
            </div>
          )}
        </div>

        {/* Right Panel: Interactive Area */}
        <div className="lg:col-span-8">
          {quizData ? (
            <QuizCard questions={quizData} />
          ) : isUploaded ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 px-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Session</span>
              </div>
              <ChatBox />
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
              <BookOpen size={64} className="mb-6 opacity-20" />
              <p className="font-bold text-slate-400">Waiting for your course materials...</p>
              <p className="text-xs text-slate-300 mt-2">Upload a PDF on the left to activate the AI Agent.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;