'use client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LeaveServerModal({ isOpen, onClose, onConfirm }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#fcf4dd] p-7 rounded-2xl shadow-2xl border-4 border-[#bfa36f] w-full max-w-sm font-serif">
                <h2 className="text-2xl font-bold mb-3 text-[#7c5b27]">Leave Server?</h2>
                <p className="text-[#7c5b27] mb-6">Are you sure you want to leave this server?</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-[#bfa36f] hover:bg-[#ad8b46] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="bg-[#ad8b46] hover:bg-[#bfa36f] text-[#2d1d09] font-bold py-2 px-4 rounded-lg border border-[#d4bc8a] shadow transition"
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}
