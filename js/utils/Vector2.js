/**
 * 2Dベクトルクラス
 */
export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // 加算
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    // 減算
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    // スカラー倍
    mul(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    // スカラー除算
    div(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    // 長さ
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // 長さの2乗（計算効率化用）
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    // 正規化
    normalize() {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return this.div(len);
    }

    // 内積
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    // 距離
    distanceTo(v) {
        return this.sub(v).length();
    }

    // 角度（ラジアン）
    angle() {
        return Math.atan2(this.y, this.x);
    }

    // 回転
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    // コピー
    clone() {
        return new Vector2(this.x, this.y);
    }

    // 静的メソッド: 角度からベクトル生成
    static fromAngle(angle, length = 1) {
        return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    // 静的メソッド: ゼロベクトル
    static zero() {
        return new Vector2(0, 0);
    }
}
