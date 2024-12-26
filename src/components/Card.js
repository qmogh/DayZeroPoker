export default function Card({ card }) {
  if (!card) return null;
  
  const color = card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-slate-900';
  
  return (
    <div className={`
      ${color} 
      bg-white 
      rounded-md
      p-3
      w-16 
      h-24 
      flex 
      flex-col 
      items-center 
      justify-between 
      border-2 
      border-gray-300
      shadow-lg
    `}>
      <span className="text-xl font-bold">{card.value}</span>
      <span className="text-3xl">{card.suit}</span>
    </div>
  );
} 