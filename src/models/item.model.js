const items = {}; // 유저 아이템 획득 정보

export const createItem = (uuid) => {
  items[uuid] = []; // 초기 스테이지 배열 생성
};

export const getItem = (uuid) => {
  return items[uuid];
};

export const setItem = (uuid, item, timestamp) => {
  return items[uuid].push({ item, timestamp });
};

export const clearitem = (uuid) => {
  return (items[uuid] = []);
};
