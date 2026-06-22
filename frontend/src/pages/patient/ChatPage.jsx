import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import { PageHeader, Card, Button } from '../../components/ui';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: userMsg, language, sessionId });
      setSessionId(data.data.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: data.data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI Health Chat" subtitle="Multilingual assistant — EN · Kinyarwanda · FR" />
      <Card className="flex h-[calc(100vh-220px)] flex-col">
        <div className="mb-4 flex gap-2">
          {[{ v: 'en', l: 'English' }, { v: 'rw', l: 'Kinyarwanda' }, { v: 'fr', l: 'French' }].map((lang) => (
            <button key={lang.v} type="button" onClick={() => setLanguage(lang.v)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${language === lang.v ? 'bg-synapse-teal text-white' : 'bg-gray-100 text-gray-600'}`}>
              {lang.l}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto rounded-lg bg-synapse-light p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-400">Ask about medications, side effects, or general health questions</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user' ? 'bg-synapse-teal text-white' : 'bg-white text-synapse-navy shadow-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="mt-4 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..."
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-synapse-teal focus:outline-none" />
          <Button type="submit" disabled={loading}>{loading ? '...' : 'Send'}</Button>
        </form>
      </Card>
    </div>
  );
}
