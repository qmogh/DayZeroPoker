import Card from './Card';

export default function CommunityCards({ cards, gameStage }) {
  const visibleCards = (() => {
    switch (gameStage) {
      case 'flop':
        return cards.slice(0, 3);
      case 'turn':
        return cards.slice(0, 4);
      case 'river':
      case 'complete':
        return cards.slice(0, 5);
      default:
        return [];
    }
  })();

  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <div className="flex gap-2 justify-center">
        {visibleCards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
} 