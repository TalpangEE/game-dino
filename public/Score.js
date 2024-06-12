import { sendEvent } from './Socket.js';
import stageJson from './assets/stage.json' with { type: 'json' };
import itemJson from './assets/stage.json' with { type: 'json' };
import itemUnlockJson from './assets/stage.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  nowStage = 1000;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  // 스테이지 변경 함수
  changeStage(nextStage) {
    if (Math.floor(this.score) >= nextStage.score && this.stageChange) {
      this.stageChange = false; // 스테이지 변경 후 stageChange를 false로 설정
      sendEvent(11, {
        currentStage: this.nowStage,
        targetStage: nextStage.id,
      });
      this.nowStage = nextStage.id;
      console.log(`현재 스테이지 ${this.nowStage}`); // 확인용 콘솔로그
    }
  }

  update(deltaTime) {
    // 현재 스테이지 찾기
    let currentStage = stageJson.data.find((stage) => stage.id === this.nowStage);
    if (currentStage) {
      // 점수 업데이트
      this.score += deltaTime * 0.001 * currentStage.scorePerSecond;
      console.log(`현재 점수: ${Math.floor(this.score)}`); // 확인용 콘솔로그

      // 다음 스테이지 찾기
      const nextStage = stageJson.data.find((stage) => stage.id === this.nowStage + 1);
      if (nextStage && Math.floor(this.score) >= nextStage.score) {
        this.stageChange = true; // 다음 스테이지로 변경하기 위해 stageChange를 true로 설정
        this.changeStage(nextStage);
      }
    }
  }

  // 아이템 획득시 점수 변화 함수
  getItem(itemId) {
    const item = itemJson.data.find((item) => item.id === itemId);

    if (item) {
      this.score += item.score;
      sendEvent(15, id, score);

      // 아이템 획득 후 다음 스테이지로 이동할 수 있는 점수가 충족되면 다음스테이지로 넘김
      const nextStage = stageJson.data.find((stage) => stage.id === this.nowStage + 1);

      if (nextStage && this.score >= nextStage.score) {
        this.stageChange = true;
        this.changeStage(nextStage);

        sendEvent(11, {
          currentStage: this.nowStage,
          targetStage: nextStage.id,
        });
      }
    } else {
      console.log(`아이템 ${itemId}을(를) 찾을 수 없음`);
    }
  }

  reset() {
    this.score = 0;
    this.stage = 1000;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
