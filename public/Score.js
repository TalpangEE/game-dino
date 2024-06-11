import { sendEvent } from './Socket.js';
import stageJson from './assets/stage.json' with { type: 'json' };

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = [];
  nowStage = 1000;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageJson = stageJson;
  }

  update(deltaTime) {
    // 현재 스테이지 찾기
    const currentStage = this.stageJson.data.find((stage) => stage.id === this.nowStage);
    // 점수 업데이트
    this.score += deltaTime * 0.001 * currentStage.scorePerSecond;
    // 다음 스테이지 찾기
    const nextStage = this.stageJson.data.find((stage) => stage.id === this.nowStage + 1);
    if (nextStage && Math.floor(this.score) >= nextStage.score) {
      this.changeStage(nextStage);
    }
  }

  // 스테이지 변경 함수
  changeStage(nextStage) {
    if (Math.floor(this.score) >= this.stageChange) {
      this.stageChange = false;
      sendEvent(11, {
        currentStage: this.nowStage,
        targetStage: nextStage.id,
      });
      this.nowStage = nextStage.id;
      console.log(`현재 스테이지 ${this.nowStage}`); // 확인용 콘솔로그
    }
  }

  getItem(itemId) {
    // 아이템 획득시 점수 변화
    this.score += 0;
  }

  reset() {
    this.score = 0;
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
