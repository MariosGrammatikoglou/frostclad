'use client';

import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

export default function CreateChannelModal({ isOpen, onClose, onSubmit }: Props) {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#fcf4dd] p-7 rounded-2xl shadow-2xl border-4 border-[#bfa36f] w-full max-w-sm font-serif">
                <h2 className="text-2xl font-bold mb-5 text-[#7c5b27]">Create New Channel</h2>
                <input
                    type="text"
                    placeholder="Channel name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#ede1bb] text-[#2e2518] border-2 border-[#ad8b46] rounded-lg px-4 py-2 w-full mb-5 focus:outline-none focus:ring-2 focus:ring-[#bfa36f] font-serif"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-[#bfa36f] hover:bg-[#ad8b46] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSubmit(name);
                            setName('');
                        }}
                        className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow transition"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
