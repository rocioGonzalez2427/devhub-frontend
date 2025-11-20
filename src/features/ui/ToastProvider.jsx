// src/features/ui/ToastProvider.jsx
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
  } from "react";
  
  // El contexto guarda solo una función showToast
  const ToastContext = createContext({ showToast: () => {} });
  
  export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
  
    const showToast = useCallback((message) => {
      if (!message) return;
      setToast(message);
      // Ocultar después de 3s
      setTimeout(() => {
        setToast(null);
      }, 3000);
    }, []);
  
    return (
      <ToastContext.Provider value={{ showToast }}>
        {children}
        {toast && <div className="toast">{toast}</div>}
      </ToastContext.Provider>
    );
  }
  
  export function useToast() {
    return useContext(ToastContext);
  }
  