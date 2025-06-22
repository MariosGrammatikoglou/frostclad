import { useEffect, useState } from 'react';

const BLOCK_SIZE = 16;
const NUM_BLOCKS = 10;

export default function LoadingBar() {
    const [filled, setFilled] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFilled(f => (f < NUM_BLOCKS ? f + 1 : 0));
        }, 120);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="window" style={{ width: NUM_BLOCKS * (BLOCK_SIZE + 4) + 50, margin: '100px auto' }}>
            <div className="title-bar">
                <div className="title-bar-text">Frostclad loading</div>
            </div>
            <div className="window-body">
                <div
                    className="field-row"
                    style={{
                        justifyContent: 'center',
                        margin: '20px 0 0 0'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: 3,
                            background: '#fff',

                            padding: 4,
                        }}
                    >
                        {Array.from({ length: NUM_BLOCKS }).map((_, i) => {
                            const isFilled = i < filled;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: BLOCK_SIZE,
                                        height: BLOCK_SIZE,
                                        background: isFilled
                                            ? (i % 2 === 0 ? '#000080' : '#B0C4DE')
                                            : 'transparent',
                                        border: isFilled
                                            ? '2px inset #fff'
                                            : 'none',
                                        boxSizing: 'border-box',
                                        transition: 'background 0.15s, border 0.15s',
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
