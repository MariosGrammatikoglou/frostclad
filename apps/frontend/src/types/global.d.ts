export { };

declare global {
    interface Window {
        winCtrl: {
            minimize(): void;
            close(): void;
        };
    }
}
