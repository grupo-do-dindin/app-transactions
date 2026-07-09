import { useEffect } from "react";

interface ReceiptModalProps {
    receiptUrl: string | null;
    onClose: () => void;
}

export const ReceiptModal = ({ receiptUrl, onClose }: ReceiptModalProps) => {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    if (!receiptUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[90vh] p-4"
            >
                <div className="flex justify-end mb-3">
                    <button
                        onClick={onClose}
                        className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-white transition hover:bg-white/20"
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </div>
                <div className="h-[80vh] w-full overflow-hidden rounded-lg bg-black">
                    <img
                        src={receiptUrl}
                        alt="Imagem ampliada"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};
