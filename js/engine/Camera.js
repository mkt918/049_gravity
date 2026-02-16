import { Vector2 } from '../utils/Vector2.js';

/**
 * カメラクラス
 */
export class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.position = Vector2.zero(); // カメラの中心位置（ワールド座標）
        this.zoom = 1; // ズームレベル
        this.minZoom = 0.05;
        this.maxZoom = 5;
        this.target = null; // 追従対象
        this.smoothing = 0.1; // カメラの滑らかさ
    }

    /**
     * 追従対象を設定
     */
    follow(target) {
        this.target = target;
    }

    /**
     * カメラ更新
     */
    update() {
        if (this.target) {
            // 滑らかに追従
            const targetPos = this.target.position;
            this.position = this.position.add(
                targetPos.sub(this.position).mul(this.smoothing)
            );
        }
    }

    /**
     * ズーム
     */
    setZoom(zoom) {
        this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    }

    /**
     * ズームイン
     */
    zoomIn(amount = 0.1) {
        this.setZoom(this.zoom + amount);
    }

    /**
     * ズームアウト
     */
    zoomOut(amount = 0.1) {
        this.setZoom(this.zoom - amount);
    }

    /**
     * ワールド座標 → スクリーン座標
     */
    worldToScreen(worldPos) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const relativePos = worldPos.sub(this.position);
        return new Vector2(
            centerX + relativePos.x * this.zoom,
            centerY + relativePos.y * this.zoom
        );
    }

    /**
     * スクリーン座標 → ワールド座標
     */
    screenToWorld(screenPos) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const relativePos = new Vector2(
            (screenPos.x - centerX) / this.zoom,
            (screenPos.y - centerY) / this.zoom
        );
        return this.position.add(relativePos);
    }

    /**
     * 自動ズーム（すべての天体が見えるように）
     */
    autoZoom(bodies) {
        if (bodies.length === 0) return;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const body of bodies) {
            minX = Math.min(minX, body.position.x - body.radius);
            maxX = Math.max(maxX, body.position.x + body.radius);
            minY = Math.min(minY, body.position.y - body.radius);
            maxY = Math.max(maxY, body.position.y + body.radius);
        }

        const worldWidth = maxX - minX;
        const worldHeight = maxY - minY;

        const zoomX = this.canvas.width / worldWidth;
        const zoomY = this.canvas.height / worldHeight;

        this.setZoom(Math.min(zoomX, zoomY) * 0.8); // 余白を持たせる
    }
}
