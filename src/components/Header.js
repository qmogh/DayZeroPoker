export default function Header() {
  return (
    <header>
      <div className="max-w-4xl mx-auto px-8 py-4">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          >
            <path 
              fillRule="evenodd" 
              d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="font-medium">Day Zero Poker</span>
        </a>
      </div>
    </header>
  );
} 