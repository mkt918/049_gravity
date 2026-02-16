import { Vector2 } from '../utils/Vector2.js';
import { GAME_G } from '../utils/Constants.js';

/**
 * 物理エンジン
 */
export class Physics {
    constructor() {
        this.bodies = [];
    }

    /**
     * 天体を追加
     */
    addBody(body) {
        this.bodies.push(body);
    }

    /**
     * 天体を削除
     */
    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index > -1) {
            this.bodies.splice(index, 1);
        }
    }

    /**
     * すべての天体をクリア
     */
    clearBodies() {
        this.bodies = [];
    }

    /**
     * 重力計算（N体問題）
     */
    calculateGravity() {
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const bodyA = this.bodies[i];
                const bodyB = this.bodies[j];

                // 距離ベクトル
                const direction = bodyB.position.sub(bodyA.position);
                const distanceSq = direction.lengthSq();
                const distance = Math.sqrt(distanceSq);

                // 重力が無限大にならないように最小距離を設定
                if (distance < 1) continue;

                // 万有引力の法則: F = G * m1 * m2 / r^2
                const forceMagnitude = GAME_G * bodyA.mass * bodyB.mass / distanceSq;
                const forceDirection = direction.normalize();
                const force = forceDirection.mul(forceMagnitude);

                // 力を適用（作用反作用）
                bodyA.applyForce(force);
                bodyB.applyForce(force.mul(-1));
            }
        }
    }

    /**
     * 物理更新
     */
    update(dt) {
        // 重力計算
        this.calculateGravity();

        // 各天体の位置更新
        for (const body of this.bodies) {
            body.update(dt);
        }
    }

    /**
     * 衝突判定
     */
    checkCollisions() {
        const collisions = [];

        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const bodyA = this.bodies[i];
                const bodyB = this.bodies[j];

                if (bodyA.isColliding(bodyB)) {
                    collisions.push({ bodyA, bodyB });
                }
            }
        }

        return collisions;
    }

    /**
     * 特定の天体との衝突判定
     */
    checkCollisionWith(body) {
        for (const other of this.bodies) {
            if (other === body) continue;
            if (body.isColliding(other)) {
                return other;
            }
        }
        return null;
    }
}
