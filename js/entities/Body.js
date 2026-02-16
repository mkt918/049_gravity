import { Vector2 } from '../utils/Vector2.js';

/**
 * 天体・宇宙船の基底クラス
 */
export class Body {
    constructor(config) {
        this.name = config.name || 'Unknown';
        this.mass = config.mass || 1;
        this.radius = config.radius || 10;
        this.position = config.position || Vector2.zero();
        this.velocity = config.velocity || Vector2.zero();
        this.acceleration = Vector2.zero();
        this.color = config.color || '#FFFFFF';
        this.fixed = config.fixed || false; // 固定（太陽など）

        // 軌跡記録
        this.trail = [];
        this.maxTrailLength = config.maxTrailLength || 100;
    }

    /**
     * 力を加える
     */
    applyForce(force) {
        if (this.fixed) return;
        // F = ma → a = F/m
        const acc = force.div(this.mass);
        this.acceleration = this.acceleration.add(acc);
    }

    /**
     * 位置を更新（Verlet積分）
     */
    update(dt) {
        if (this.fixed) return;

        // 速度更新: v = v + a * dt
        this.velocity = this.velocity.add(this.acceleration.mul(dt));

        // 位置更新: p = p + v * dt
        const newPosition = this.position.add(this.velocity.mul(dt));

        // 軌跡記録
        this.trail.push(this.position.clone());
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        this.position = newPosition;

        // 加速度リセット
        this.acceleration = Vector2.zero();
    }

    /**
     * 描画
     */
    draw(ctx, camera) {
        const screenPos = camera.worldToScreen(this.position);
        const screenRadius = this.radius * camera.zoom;

        // 軌跡描画
        if (this.trail.length > 1) {
            ctx.strokeStyle = this.color + '40'; // 半透明
            ctx.lineWidth = 1;
            ctx.beginPath();
            const firstPoint = camera.worldToScreen(this.trail[0]);
            ctx.moveTo(firstPoint.x, firstPoint.y);
            for (let i = 1; i < this.trail.length; i++) {
                const point = camera.worldToScreen(this.trail[i]);
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        }

        // 本体描画
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
        ctx.fill();

        // グロー効果（太陽など）
        if (this.glowColor) {
            const gradient = ctx.createRadialGradient(
                screenPos.x, screenPos.y, screenRadius * 0.5,
                screenPos.x, screenPos.y, screenRadius * 2
            );
            gradient.addColorStop(0, this.glowColor + '80');
            gradient.addColorStop(1, this.glowColor + '00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, screenRadius * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 名前表示
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, screenPos.x, screenPos.y - screenRadius - 10);
    }

    /**
     * 他の天体との距離
     */
    distanceTo(other) {
        return this.position.distanceTo(other.position);
    }

    /**
     * 衝突判定
     */
    isColliding(other) {
        const distance = this.distanceTo(other);
        return distance < (this.radius + other.radius);
    }
}
