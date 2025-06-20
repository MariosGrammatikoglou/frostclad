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
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

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

    // Only auto-scroll if user is near bottom
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
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempMessage.id ? res.data : msg
                )
            );
        } catch (err) {
            setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className="window" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="title-bar">
                <div className="title-bar-text">Channel Chat</div>
            </div>
            <div
                ref={messagesContainerRef}
                className="window-body"
                style={{
                    flex: 1,
                    overflowY: "auto",
                    background: "#fff",
                    padding: 8,
                    fontFamily: 'inherit'
                }}
            >
                {messages.map((msg, idx) => (
                    <div key={msg.id ?? idx} style={{
                        marginBottom: 8,
                        padding: 6,
                        border: "1px solid #c0c0c0",
                        background: "#e9e9e9"
                    }}>
                        <b>{msg.user?.username ?? 'Unknown'}:</b> {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    sendMessage();
                }}
                style={{
                    display: "flex",
                    gap: 4,
                    padding: 8,
                    borderTop: "2px solid #c0c0c0",
                    background: "#dfdfdf"
                }}
            >
                <input
                    className="field"
                    style={{ flex: 1 }}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button type="submit" className="button">Send</button>
            </form>
        </div>
    );
}
