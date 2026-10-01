import { useEffect, useState } from "react";

function useTheme(){
    const [theme, setTheme] = useState(()=>{
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    });

    useEffect(()=> {
        const root = document.documentElement;
        if (theme === 'dark'){
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

    return {theme, isDark: theme === 'dark', toggleTheme, setTheme}

};

export default useTheme;