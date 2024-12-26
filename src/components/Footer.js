export default function Footer() {
  return (
    <footer className="text-center py-4 text-slate-400">
      <p>
        Made with ♥️ by{' '}
        <a 
          href="https://amogh.sh" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          Amogh
        </a>
        {' '}&bull;{' '}
        <a 
          href="https://github.com/qmogh/PokerHandTrainer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
} 