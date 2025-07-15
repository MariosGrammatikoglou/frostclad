export { };

declare global {
    interface Window {
        electron?: {
            minimize: () => void;
            close: () => void;
        };
    }
}
