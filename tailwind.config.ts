@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --background: #fdfbf7;
    --foreground: #1a1a1a;
    --css - green: #1a3b28;
}

body {
    background - color: var(--background);
    color: var(--foreground);
    margin: 0;
    padding: 0;
    overflow - x: hidden; /* Sağa kaymayı kesin olarak engeller */
}

/* Sayfayı her ekranda tam ortalayan konteyner */
.page - container {
    width: 100 %;
    max - width: 1200px;
    margin - left: auto;
    margin - right: auto;
    padding - left: 1.5rem;
    padding - right: 1.5rem;
}