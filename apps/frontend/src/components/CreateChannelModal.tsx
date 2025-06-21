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
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="window" style={{ minWidth: 340, maxWidth: '90vw' }}>
                <div className="title-bar" style={{ paddingLeft: '8px', paddingTop: '4px', paddingBottom: '4px' }}>
                    <div className="title-bar-text">Create New Channel</div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={onClose} />
                    </div>
                </div>
                <div className="window-body" style={{ padding: 16 }}>
                    <input
                        type="text"
                        placeholder="Channel name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="field"
                        style={{ width: '100%', marginBottom: 12 }}
                        maxLength={16}  // <-- Limit to 16 characters
                    />

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="button" onClick={onClose}>Cancel</button>
                        <button
                            className="button"
                            onClick={() => {
                                onSubmit(name);
                                setName('');
                            }}
                        >Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
