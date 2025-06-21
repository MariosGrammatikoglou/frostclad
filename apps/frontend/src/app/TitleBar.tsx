'use client';
export default function TitleBar() {
    return (
        <div id="titlebar">
            <div className="drag-area">Frostclad</div>
            <div className="controls">
                <button onClick={() => window.winCtrl.minimize()}>—</button>
                <button onClick={() => window.winCtrl.maximize()}>☐</button>
                <button onClick={() => window.winCtrl.close()}>×</button>
            </div>
        </div>
    );
}
