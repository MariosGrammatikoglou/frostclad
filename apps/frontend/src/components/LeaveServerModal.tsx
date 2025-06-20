'use client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LeaveServerModal({ isOpen, onClose, onConfirm }: Props) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="window" style={{ minWidth: 320, maxWidth: '90vw' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Leave Server?</div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={onClose} />
                    </div>
                </div>
                <div className="window-body" style={{ padding: 16 }}>
                    <p>Are you sure you want to leave this server?</p>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
                        <button className="button" onClick={onClose}>Cancel</button>
                        <button
                            className="button"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >Leave</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
