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
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">Create New Channel</h2>
                <input
                    type="text"
                    placeholder="Channel name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSubmit(name);
                            setName('');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
