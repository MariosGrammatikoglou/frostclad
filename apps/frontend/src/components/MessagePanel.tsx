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

        return () => {
            mounted = false;
            clearInterval(poller);
        };
    }, [channelId]);

    // Auto-scroll if at bottom
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Only scroll if user is near the bottom (classic chat UX)
        const threshold = 40;
        const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

        if (atBottom) {
            container.scrollTop = container.scrollHeight;
        }
        // If not at bottom, do not auto-scroll!
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
            const res = await api.post(`/messages/${channelId}`, { content: message });
            setMessages((prev) =>
                prev.map((msg) => (msg.id === tempMessage.id ? res.data : msg))
            );
        } catch (err) {
            setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
            console.error('Failed to send message:', err);
        }

        // Force scroll to bottom
        setTimeout(() => {
            const container = messagesContainerRef.current;
            if (container) container.scrollTop = container.scrollHeight;
        }, 50);
    };

    return (
        <div
            className="window"
            style={{
                height: 480, // fixed, classic IM size
                minWidth: 330,
                display: 'flex',
                flexDirection: 'column',
                margin: 0,
                padding: 0,
                background: '#efefef'
            }}
        >
            <div className="title-bar">
                <div className="title-bar-text">Channel Chat</div>
            </div>
            <div
                ref={messagesContainerRef}
                className="window-body"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    background: '#efefef',
                    padding: 8,
                    border: 'none',
                    marginBottom: 0
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={msg.id ?? idx}
                        className="field-row"
                        style={{
                            background: '#fff',
                            border: '1px solid #bbb',
                            marginBottom: 6,
                            borderRadius: 2,
                            padding: '4px 8px',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: 26,
                            maxWidth: 320,
                            wordBreak: 'break-word',
                            boxShadow: '0 1px 0 #eee'
                        }}
                    >
                        <span style={{ fontWeight: 'bold', color: '#00509E', marginRight: 4 }}>
                            {msg.user?.username ?? 'Unknown'}:
                        </span>
                        <span>{msg.content}</span>
                    </div>
                ))}
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    sendMessage();
                }}
                style={{ display: 'flex', borderTop: '1px solid #b0b0b0', padding: 6, background: '#ddd' }}
            >
                <input
                    type="text"
                    className="input"
                    placeholder="Type your message…"
                    value={message}
                    style={{ flex: 1, marginRight: 8, minHeight: 28, fontSize: 14 }}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button type="submit" className="button">Send</button>
            </form>
        </div>
    );
}
