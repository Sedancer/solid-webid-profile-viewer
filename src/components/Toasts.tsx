import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "info" | "success" | "error";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastsContextProps {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastsContext = createContext<ToastsContextProps | undefined>(undefined);

export const useToasts = () => {
    const context = useContext(ToastsContext);
    if (!context) {
        throw new Error("useToasts must be used within a ToastsProvider");
    }
    return context;
};

export const ToastsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastsContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`px-4 py-2 rounded-2xl shadow-md text-white ${
                                toast.type === "success"
                                    ? "bg-green-500"
                                    : toast.type === "error"
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                            }`}
                        >
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastsContext.Provider>
    );
};