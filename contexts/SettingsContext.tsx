import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-2.5-flash';

interface SettingsContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    selectedModel: AIModel;
    setSelectedModel: (model: AIModel) => void;
    isSettingsOpen: boolean;
    setIsSettingsOpen: (isOpen: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const AVAILABLE_MODELS: { id: AIModel; name: string; desc: string }[] = [
    {
        id: 'gemini-3-flash-preview',
        name: 'Gemini 3.0 Flash',
        desc: 'Tốc độ cao, chi phí thấp (Khuyên dùng)'
    },
    {
        id: 'gemini-3-pro-preview',
        name: 'Gemini 3.0 Pro',
        desc: 'Cân bằng giữa thông minh và tốc độ'
    },
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        desc: 'Phiên bản ổn định, tốc độ rất nhanh'
    },
];

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState('');
    const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-3-flash-preview');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('GEMINI_API_KEY');
        if (storedKey) {
            setApiKeyState(storedKey);
        } else {
            setIsSettingsOpen(true);
        }

        const storedModel = localStorage.getItem('PREFERRED_MODEL');
        if (storedModel && AVAILABLE_MODELS.some(m => m.id === storedModel)) {
            setSelectedModel(storedModel as AIModel);
        }
    }, []);

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        localStorage.setItem('GEMINI_API_KEY', key);
    };

    const handleSetModel = (model: AIModel) => {
        setSelectedModel(model);
        localStorage.setItem('PREFERRED_MODEL', model);
    };

    return (
        <SettingsContext.Provider
            value={{
                apiKey,
                setApiKey,
                selectedModel,
                setSelectedModel: handleSetModel,
                isSettingsOpen,
                setIsSettingsOpen
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
