import React, { useState } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { askAI } from '../api';

const ChatBox = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: input }]);
        setLoading(true);
        try {
            const data = await askAI(input);
            setMessages(prev => [...prev, { role: 'bot', text: data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI engine." }]);
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-2 max-w-[80%] p-3 rounded-xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                            {m.role === 'bot' ? <Bot size={18} /> : <User size={18} />}
                            <p className="text-sm leading-relaxed">{m.text}</p>
                        </div>
                    </div>
                ))}
                {loading && <div className="flex gap-2 text-slate-400 italic text-xs"><Loader2 className="animate-spin" size={14} /> Copilot is researching...</div>}
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-2 bg-slate-50">
                <input
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask something about the course..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;