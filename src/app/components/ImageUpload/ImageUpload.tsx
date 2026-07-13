import { useState } from "react";
import { Search, Trash2 } from "lucide-react";

interface ImageUploadProps {
    imageUrl: string | null;
    onImageSelect: (dataUrl: string) => void;
    onImageRemove: () => void;
    onImagePreview: (dataUrl: string) => void;
    label?: string;
    maxSize?: number; // in bytes, default 2MB
}

export const ImageUpload = ({
    imageUrl,
    onImageSelect,
    onImageRemove,
    onImagePreview,
    label = "Imagem",
    maxSize = 2 * 1024 * 1024,
}: ImageUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Por favor, selecione uma imagem válida.");
            return;
        }
        if (file.size > maxSize) {
            alert(`Arquivo muito grande (máx ${maxSize / 1024 / 1024}MB).`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            onImageSelect(dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        processFile(file);
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-[#7C7C8A]">{label}</label>

            {!imageUrl ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${isDragging
                        ? "border-[#00B37E] bg-[#00B37E]/10"
                        : "border-[#C4C4CC] dark:border-[#323238] hover:border-[#00B37E] hover:bg-white/5 dark:hover:bg-[#323238]/50"
                        }`}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <Search className="h-8 w-8 text-[#C4C4CC] dark:text-[#7C7C8A]" />
                        <div className="text-sm">
                            <p className="text-[#7C7C8A]">Arraste seu arquivo aqui</p>
                            <p className="text-xs text-[#7C7C8A]">ou clique para selecionar</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-end gap-2">
                    <div className="flex-1 relative h-[120px] overflow-hidden rounded-lg bg-[#f6fdf8] dark:bg-[#111214] group">
                        <button
                            type="button"
                            onClick={() => onImagePreview(imageUrl)}
                            className="absolute inset-0 z-10"
                            aria-label="Abrir prévia"
                        />
                        <img
                            src={imageUrl}
                            alt="Imagem selecionada"
                            className="h-full w-full object-cover transition duration-200 group-hover:blur-sm"
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-200 group-hover:bg-black/30">
                            <Search className="h-8 w-8 text-white opacity-0 transition duration-200 group-hover:opacity-100" />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onImageRemove}
                        className="h-[120px] px-3 rounded-lg text-[#E74C3C] dark:text-[#F75A68] transition hover:bg-white/10 dark:hover:bg-[#323238]"
                        aria-label="Remover imagem"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};
