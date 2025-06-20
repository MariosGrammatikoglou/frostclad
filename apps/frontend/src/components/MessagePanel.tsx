'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import useAuth from '@/hooks/useAuth';

type Message = {
    id?: string;
    content: string;
    createdAt?: string;
    user?: { username: string; };
};

export default function MessagePanel({ channelId }: { channelId: string }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    // Fetch messages
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

        loadMessages();
        poller = setInterval(loadMessages, 2000);
        return () => { mounted = false; clearInterval(poller); };
    }, [channelId]);

    // Only auto-scroll if user is at bottom
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const threshold = 100;
        const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        if (atBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!message.trim()) return;
        const tempMessage = {
            id: 'temp-' + Date.now(),
            content: message,
            user: { username: user?.username || 'You' },
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMessage]);
        setMessage('');
        try {
            const res = await api.post(`/messages/${channelId}`, { content: message });
            setMessages((prev) => prev.map((msg) => msg.id === tempMessage.id ? res.data : msg));
        } catch {
            setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
        }
    };

    return (
        <div className="window" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', margin: 8 }}>
            <div className="title-bar">
                <div className="title-bar-text">Channel Chat</div>
            </div>
            <div
                ref={messagesContainerRef}
                className="window-body"
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    background: '#fff',
                    padding: 12,
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={msg.id ?? idx}
                        style={{
                            marginBottom: 6,
                            padding: "7px 12px",
                            background: "#eee",
                            border: "1px solid #bbb",
                            fontSize: 15,
                        }}
                    >
                        <b>{msg.user?.username ?? 'Unknown'}:</b> {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form
                className="window-body"
                style={{ display: "flex", borderTop: "1px solid #ccc", gap: 8, background: "#eee", margin: 0 }}
                onSubmit={e => { e.preventDefault(); sendMessage(); }}
            >
                <input
                    className="input"
                    style={{ flex: 1 }}
                    value={message}
                    placeholder="Type a message..."
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                />
                <button type="submit" className="button" style={{ minWidth: 80 }}>
                    Send
                </button>
            </form>
        </div>
    );
}
