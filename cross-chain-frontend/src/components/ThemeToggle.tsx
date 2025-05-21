"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "light") {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        } else {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        setIsDark((prev) => {
            const next = !prev;
            if (next) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
            return next;
        });
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="fixed bottom-6 left-6 z-50 bg-gray-200 dark:bg-gray-800 rounded-full p-3 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
            {isDark ? (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            ) : (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71" /><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
            )}
        </button>
    );
} 