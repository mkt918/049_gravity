/**
 * 入力管理クラス
 */
export class Input {
    constructor() {
        this.keys = {};
        this.keysPressed = {}; // 1フレームだけtrueになるキー

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key]) {
                this.keysPressed[e.key] = true;
            }
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    /**
     * キーが押されているか
     */
    isKeyDown(key) {
        return this.keys[key] || false;
    }

    /**
     * キーが押された瞬間か（1フレームのみ）
     */
    isKeyPressed(key) {
        return this.keysPressed[key] || false;
    }

    /**
     * フレーム終了時にリセット
     */
    update() {
        this.keysPressed = {};
    }
}
