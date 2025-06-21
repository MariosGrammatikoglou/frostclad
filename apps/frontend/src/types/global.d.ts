export { };

declare global {
    interface Window {
        winCtrl: {
            minimize(): void;
            maximize(): void;
            close(): void;
        };
    }
}
