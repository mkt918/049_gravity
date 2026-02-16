/**
 * レンダラークラス
 */
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();

        // リサイズイベント
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * キャンバスのリサイズ
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * 画面クリア
     */
    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 星空背景
        this.drawStars();
    }

    /**
     * 星空描画
     */
    drawStars() {
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2;
            this.ctx.fillRect(x, y, size, size);
        }
    }

    /**
     * グリッド描画（デバッグ用）
     */
    drawGrid(camera, spacing = 100) {
        this.ctx.strokeStyle = '#FFFFFF10';
        this.ctx.lineWidth = 1;

        const startX = Math.floor(camera.position.x / spacing) * spacing - spacing * 10;
        const startY = Math.floor(camera.position.y / spacing) * spacing - spacing * 10;

        for (let i = 0; i < 20; i++) {
            const worldX = startX + i * spacing;
            const screenStart = camera.worldToScreen({ x: worldX, y: startY });
            const screenEnd = camera.worldToScreen({ x: worldX, y: startY + spacing * 20 });

            this.ctx.beginPath();
            this.ctx.moveTo(screenStart.x, screenStart.y);
            this.ctx.lineTo(screenEnd.x, screenEnd.y);
            this.ctx.stroke();
        }

        for (let i = 0; i < 20; i++) {
            const worldY = startY + i * spacing;
            const screenStart = camera.worldToScreen({ x: startX, y: worldY });
            const screenEnd = camera.worldToScreen({ x: startX + spacing * 20, y: worldY });

            this.ctx.beginPath();
            this.ctx.moveTo(screenStart.x, screenStart.y);
            this.ctx.lineTo(screenEnd.x, screenEnd.y);
            this.ctx.stroke();
        }
    }

    /**
     * すべての天体を描画
     */
    drawBodies(bodies, camera) {
        for (const body of bodies) {
            body.draw(this.ctx, camera);
        }
    }
}
