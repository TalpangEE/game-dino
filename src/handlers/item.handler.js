import { getItem, setItem } from '../models/item.model.js';
import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

// 아이템 획득 핸들러
export const itemGetHandler = (userId, payload) => {
  const { id, timestamp } = payload;
  const { items, itemUnlocks } = getGameAssets();

  // 유저의 현재 스테이지 정보 가져오기
  const userStage = getStage(userId);
  const currentStage = userStage[userStage.length - 1].id;

  // 아이템 존재 여부 확인 및 점수 가져오기
  const item = items.data.find((i) => i.id === id);
  if (!item) {
    return { status: 'fail', message: '아이템이 존재하지 않음' };
  }

  // 아이템이 현재 스테이지에서 획득 가능한지 확인
  const stageItemUnlock = itemUnlocks.data.find(
    (info) => info.stage_id === currentStage && info.item_id === id,
  );
  if (!stageItemUnlock) {
    return { status: 'fail', message: '획득할 수 없는 아이템' };
  }

  // 아이템 획득 처리
  setItem(userId, item, timestamp);

  // 유저의 현재 점수 업데이트
  const currentStageScore = userStage[userStage.length - 1].score;
  const newScore = currentStageScore + item.score;
  setStage(userId, currentStage, newScore, timestamp);

  return { status: 'success', newScore };
};
