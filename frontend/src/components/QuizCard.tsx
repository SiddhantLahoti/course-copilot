import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    answer: string;
}

const QuizCard = ({ questions }: { questions: Question[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const q = questions[currentIndex];

    const handleAnswer = (opt: string) => {
        setSelected(opt);
        if (opt === q.answer) setScore(s => s + 1);

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1);
                setSelected(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    if (showResult) return (
        <div className="text-center p-8 bg-blue-50 rounded-2xl border border-blue-100">
            <BrainCircuit className="mx-auto text-blue-600 mb-2" size={32} />
            <h3 className="text-xl font-bold text-blue-900">Quiz Complete!</h3>
            <p className="text-blue-700">You scored {score} out of {questions.length}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm font-bold text-blue-600 underline">Try another PDF</button>
        </div>
    );

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm"
            >
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Question {currentIndex + 1}/3</span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 mb-6">{q.question}</h3>
                <div className="space-y-3">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            disabled={!!selected}
                            onClick={() => handleAnswer(opt)}
                            className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex justify-between items-center
                                ${selected === opt ? (opt === q.answer ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700') : 'hover:border-blue-300 border-slate-100'}
                            `}
                        >
                            {opt}
                            {selected === opt && (opt === q.answer ? <CheckCircle2 size={18} /> : <XCircle size={18} />)}
                        </button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuizCard;