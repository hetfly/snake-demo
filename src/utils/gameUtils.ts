export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export const INITIAL_DIRECTION: Direction = 'RIGHT';

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export function getNextPosition(position: Position, direction: Direction): Position {
  switch (direction) {
    case 'UP':
      return { x: position.x, y: position.y - 1 };
    case 'DOWN':
      return { x: position.x, y: position.y + 1 };
    case 'LEFT':
      return { x: position.x - 1, y: position.y };
    case 'RIGHT':
      return { x: position.x + 1, y: position.y };
    default:
      return position;
  }
}

export function checkWallCollision(position: Position): boolean {
  return (
    position.x < 0 ||
    position.x >= GRID_SIZE ||
    position.y < 0 ||
    position.y >= GRID_SIZE
  );
}

export function checkSelfCollision(snake: Position[]): boolean {
  if (snake.length < 4) return false;
  const head = snake[0];
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

export function checkFoodCollision(snake: Position[], food: Position): boolean {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}

export function generateFood(snake: Position[]): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
}

export function isValidDirection(
  currentDirection: Direction,
  newDirection: Direction
): boolean {
  return newDirection !== OPPOSITE_DIRECTIONS[currentDirection];
}

