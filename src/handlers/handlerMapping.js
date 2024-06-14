import { moveStageHandler } from './stage.handler.js';
import { gameEnd, gameStart } from './game.handler.js';
import { itemGetHandler } from './item.handler.js';
const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  15: itemGetHandler,
};

export default handlerMappings;
