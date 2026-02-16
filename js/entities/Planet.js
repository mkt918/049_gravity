import { Body } from './Body.js';
import { Vector2 } from '../utils/Vector2.js';

/**
 * 惑星クラス
 */
export class Planet extends Body {
    constructor(config) {
        super(config);
        this.orbitRadius = config.orbitRadius || 0;
        this.orbitSpeed = config.orbitSpeed || 0;
        this.orbitAngle = config.orbitAngle || 0;
        this.atmosphereHeight = config.atmosphereHeight || 0;
        this.glowColor = config.glowColor || null;
    }

    /**
     * 軌道運動の更新
     */
    updateOrbit(dt, centerBody) {
        if (this.orbitRadius === 0) return;

        // 角度更新
        this.orbitAngle += this.orbitSpeed * dt;

        // 位置計算（円軌道）
        this.position = new Vector2(
            centerBody.position.x + Math.cos(this.orbitAngle) * this.orbitRadius,
            centerBody.position.y + Math.sin(this.orbitAngle) * this.orbitRadius
        );

        // 速度計算（接線方向）
        const tangent = new Vector2(
            -Math.sin(this.orbitAngle),
            Math.cos(this.orbitAngle)
        );
        this.velocity = tangent.mul(this.orbitSpeed * this.orbitRadius / dt);
    }

    /**
     * 描画（大気圏も含む）
     */
    draw(ctx, camera) {
        const screenPos = camera.worldToScreen(this.position);
        const screenRadius = this.radius * camera.zoom;

        // 軌道描画
        if (this.orbitRadius > 0) {
            ctx.strokeStyle = this.color + '20';
            ctx.lineWidth = 1;
            ctx.beginPath();
            const orbitScreenRadius = this.orbitRadius * camera.zoom;
            const centerScreenPos = camera.worldToScreen(new Vector2(0, 0));
            ctx.arc(centerScreenPos.x, centerScreenPos.y, orbitScreenRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 大気圏描画
        if (this.atmosphereHeight > 0) {
            const atmosphereRadius = (this.radius + this.atmosphereHeight / 10) * camera.zoom;
            const gradient = ctx.createRadialGradient(
                screenPos.x, screenPos.y, screenRadius,
                screenPos.x, screenPos.y, atmosphereRadius
            );
            gradient.addColorStop(0, this.color + '40');
            gradient.addColorStop(1, this.color + '00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, atmosphereRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 本体描画（親クラスのメソッド）
        super.draw(ctx, camera);
    }

    /**
     * 表面からの高度を計算
     */
    getAltitude(position) {
        const distance = this.position.distanceTo(position);
        return distance - this.radius;
    }
}
