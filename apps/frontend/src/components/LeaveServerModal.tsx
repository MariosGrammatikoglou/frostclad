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
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">Leave Server?</h2>
                <p className="text-gray-300 mb-4">Are you sure you want to leave this server?</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}
