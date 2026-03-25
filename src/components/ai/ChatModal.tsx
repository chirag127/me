import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { executeAgent } from '../../lib/ai/agent';

export const ChatModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, loadMessages, addMessage, setLoading } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');
    
    await addMessage({ role: 'user', content: userQuery });
    setLoading(true);

    try {
      const response = await executeAgent(userQuery);
      await addMessage({
        role: 'assistant',
        content: response.content,
        intent: response.intent,
        confidence: response.confidence
      });
    } catch (error) {
      console.error(error);
      await addMessage({ role: 'assistant', content: 'Connection failed. Please retry.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 w-full max-w-md h-[600px] max-h-[80vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-zinc-200 dark:border-zinc-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Chirag's AI</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Ask me anything about Chirag</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
                <p>Hello! I am Chirag's personal AI assistant.</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  <button onClick={() => setInput("What are Chirag's top skills?")} className="text-xs px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">What are his top skills?</button>
                  <button onClick={() => setInput("Tell me about his recent projects")} className="text-xs px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Tell me about projects</button>
                </div>
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.intent && msg.role === 'assistant' && (
                    <span className="text-[10px] mt-2 block opacity-50 uppercase tracking-widest">
                      {msg.intent} • {(msg.confidence || 0) * 100}% CONFIDENCE
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-sm flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                  <span className="text-sm opacity-50">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Chirag..."
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
