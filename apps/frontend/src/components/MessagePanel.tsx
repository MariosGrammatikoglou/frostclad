'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import useAuth from '@/hooks/useAuth';

type Message = {
    id?: string;
    content: string;
    createdAt?: string;
    user?: {
        username: string;
    };
};

export default function MessagePanel({ channelId }: { channelId: string }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Poll for new messages
    useEffect(() => {
        let mounted = true;
        let poller: NodeJS.Timeout;

        const loadMessages = async () => {
            try {
                const res = await api.get(`/messages/${channelId}`);
                if (mounted) setMessages(res.data);
            } catch (err) {
                if (mounted) console.error('Failed to load messages:', err);
            }
        };

        loadMessages(); // Initial load

        poller = setInterval(loadMessages, 2000); // Poll every 2 seconds

        return () => {
            mounted = false;
            clearInterval(poller);
        };
    }, [channelId]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        // Optimistic update
        const tempMessage = {
            id: 'temp-' + Date.now(),
            content: message,
            user: { username: user?.username || 'You' },
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMessage]);
        setMessage('');

        try {
            const res = await api.post(`/messages/${channelId}`, {
                content: message,
            });
            // Replace temp message with saved one
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempMessage.id ? res.data : msg
                )
            );
        } catch (err) {
            // Remove temp message if failed
            setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div
            className="flex flex-col h-full border-4 border-[#bfa36f] rounded-2xl shadow-2xl bg-[#ece2cc]/80 medieval-chat-panel font-serif"
        >
            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto px-6 py-4 space-y-3 medieval-scrollbar"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={msg.id ?? idx}
                        className="rounded px-4 py-2 bg-[#ede1bb]/60 border border-[#d7c28a] shadow font-serif mb-2 last:mb-0"
                    >
                        <span className="font-bold text-[#855e2b] tracking-wide">
                            {msg.user?.username ?? 'Unknown'}
                        </span>
                        <span className="mx-2 text-[#b38c4a]">:</span>
                        <span className="text-[#3a250e]">{msg.content}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex p-4 border-t border-[#bfa36f] bg-[#ede1bb]/70 rounded-b-2xl">
                <input
                    className="flex-1 p-3 bg-[#fffaf1] text-[#3a250e] rounded-l-xl border-none outline-none placeholder:text-[#bfa36f]"
                    placeholder="Speak, traveler..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] px-5 py-3 rounded-r-xl font-bold border-l border-[#bfa36f] shadow-md transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
