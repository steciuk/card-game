const shapes = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
const colors = ['C', 'D', 'H', 'S'] as const;
export type Card = `${typeof shapes[number]}${typeof colors[number]}`;
