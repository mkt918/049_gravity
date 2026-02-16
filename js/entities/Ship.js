import { Body } from './Body.js';
import { Vector2 } from '../utils/Vector2.js';
import { SHIP } from '../utils/Constants.js';

/**
 * 宇宙船クラス
 */
export class Ship extends Body {
    constructor(config) {
        super({
            ...config,
            mass: SHIP.mass,
            radius: SHIP.radius,
            color: SHIP.color
        });

        this.fuel = config.fuel || SHIP.fuel;
        this.maxThrust = SHIP.maxThrust;
        this.fuelConsumption = SHIP.fuelConsumption;
        this.angle = config.angle || 0; // 機体の向き（ラジアン）
        this.thrusting = false;
        this.rotationSpeed = 0.05; // 回転速度
    }

    /**
     * 推力を適用
     */
    applyThrust(dt) {
        if (this.fuel <= 0) {
            this.thrusting = false;
            return;
        }

        // 推力方向（機体の向き）
        const thrustDirection = Vector2.fromAngle(this.angle);
        const thrustForce = thrustDirection.mul(this.maxThrust);

        this.applyForce(thrustForce);

        // 燃料消費
        this.fuel -= this.fuelConsumption * dt;
        if (this.fuel < 0) this.fuel = 0;

        this.thrusting = true;
    }

    /**
     * 回転
     */
    rotate(direction) {
        // direction: -1 (左), 1 (右)
        this.angle += direction * this.rotationSpeed;
    }

    /**
     * 更新
     */
    update(dt) {
        super.update(dt);

        // 質量更新（燃料消費による）
        this.mass = SHIP.mass + this.fuel;
    }

    /**
     * 描画
     */
    draw(ctx, camera) {
        const screenPos = camera.worldToScreen(this.position);
        const screenRadius = this.radius * camera.zoom;

        // 軌跡描画
        if (this.trail.length > 1) {
            ctx.strokeStyle = this.color + '60';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const firstPoint = camera.worldToScreen(this.trail[0]);
            ctx.moveTo(firstPoint.x, firstPoint.y);
            for (let i = 1; i < this.trail.length; i++) {
                const point = camera.worldToScreen(this.trail[i]);
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        }

        // 推力エフェクト
        if (this.thrusting) {
            const thrustLength = screenRadius * 3;
            const thrustWidth = screenRadius * 0.8;
            const thrustAngle = this.angle + Math.PI; // 逆方向

            ctx.save();
            ctx.translate(screenPos.x, screenPos.y);
            ctx.rotate(thrustAngle);

            // 炎のグラデーション
            const gradient = ctx.createLinearGradient(0, 0, thrustLength, 0);
            gradient.addColorStop(0, SHIP.thrustColor);
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FFFF0000');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(thrustLength, -thrustWidth / 2);
            ctx.lineTo(thrustLength * 0.7, 0);
            ctx.lineTo(thrustLength, thrustWidth / 2);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        // 機体描画（三角形）
        ctx.save();
        ctx.translate(screenPos.x, screenPos.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(screenRadius * 1.5, 0);
        ctx.lineTo(-screenRadius, screenRadius);
        ctx.lineTo(-screenRadius, -screenRadius);
        ctx.closePath();
        ctx.fill();

        // 機体の縁取り
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // 速度ベクトル表示（デバッグ用）
        if (camera.zoom > 0.5) {
            const velocityScale = 0.1;
            const velocityEnd = this.position.add(this.velocity.mul(velocityScale));
            const velocityScreenEnd = camera.worldToScreen(velocityEnd);

            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(velocityScreenEnd.x, velocityScreenEnd.y);
            ctx.stroke();
        }
    }

    /**
     * 燃料残量（パーセント）
     */
    getFuelPercent() {
        return (this.fuel / SHIP.fuel) * 100;
    }

    /**
     * リセット
     */
    reset(position, velocity, angle) {
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.angle = angle;
        this.fuel = SHIP.fuel;
        this.acceleration = Vector2.zero();
        this.trail = [];
        this.thrusting = false;
    }
}
