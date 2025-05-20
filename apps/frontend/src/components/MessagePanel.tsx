'use client';

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '@/lib/axios';
import useAuth from '@/hooks/useAuth';

const socket = io('http://localhost:4000'); // ✅ Your backend with Socket.IO

type Message = {
    id?: string;
    content: string;
    timestamp: string;
    senderId?: string;
    user?: {
        username: string;
    };
};



export default function MessagePanel({ channelId }: { channelId: string }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        socket.emit('join-channel', channelId);

        socket.on('receive-message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('receive-message');
        };
    }, [channelId]);

    // ✅ 2. Load existing messages from DB on first mount
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const res = await api.get(`/messages/${channelId}`);
                setMessages(res.data);
                scrollToBottom();
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };

        loadMessages();
    }, [channelId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };


    // ✅ 3. Save message to backend, then emit to others
    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            const res = await api.post(`/messages/${channelId}`, {
                content: message,
            });

            const saved = res.data;

            setMessages((prev) => [...prev, saved]);
            socket.emit('send-message', { channelId, message: saved });

            setMessage('');
            scrollToBottom();
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };


    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-800 rounded">
                {messages.map((msg, index) => (
                    <div key={index} className="text-sm text-white">
                        <strong>{msg.user?.username ?? msg.senderId ?? 'Unknown'}:</strong>{' '}
                        {msg.content}
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <div className="mt-2 flex">
                <input
                    className="flex-1 p-2 bg-gray-700 text-white rounded-l"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 px-4 rounded-r text-white"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
