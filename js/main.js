import { Physics } from './engine/Physics.js';
import { Renderer } from './engine/Renderer.js';
import { Camera } from './engine/Camera.js';
import { Input } from './engine/Input.js';
import { Planet } from './entities/Planet.js';
import { Ship } from './entities/Ship.js';
import { Vector2 } from './utils/Vector2.js';
import { CELESTIAL_BODIES, TIME_SCALES, LANDING } from './utils/Constants.js';

/**
 * ゲームクラス
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(this.canvas);
        this.camera = new Camera(this.canvas);
        this.physics = new Physics();
        this.input = new Input();

        this.sun = null;
        this.planets = [];
        this.ship = null;

        this.timeScale = 1;
        this.timeScaleIndex = 0;
        this.running = false;
        this.gameOver = false;

        this.lastTime = performance.now();

        this.setupUI();
    }

    /**
     * UI設定
     */
    setupUI() {
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');

        startBtn.addEventListener('click', () => {
            document.getElementById('menu').classList.add('hidden');
            this.start();
        });

        restartBtn.addEventListener('click', () => {
            document.getElementById('game-over').classList.add('hidden');
            this.reset();
            this.start();
        });
    }

    /**
     * ゲーム初期化
     */
    init() {
        // 太陽
        this.sun = new Planet({
            ...CELESTIAL_BODIES.sun,
            position: Vector2.zero(),
            fixed: true
        });
        this.physics.addBody(this.sun);

        // 惑星
        const planetNames = ['mercury', 'venus', 'earth', 'mars'];
        for (const name of planetNames) {
            const config = CELESTIAL_BODIES[name];
            const planet = new Planet({
                ...config,
                orbitAngle: Math.random() * Math.PI * 2
            });
            planet.updateOrbit(1, this.sun);
            this.planets.push(planet);
            this.physics.addBody(planet);
        }

        // 宇宙船（地球の軌道上に配置）
        const earth = this.planets.find(p => p.name === '地球');
        const shipPosition = earth.position.clone();
        const shipVelocity = earth.velocity.clone();

        this.ship = new Ship({
            name: '宇宙船',
            position: shipPosition,
            velocity: shipVelocity,
            angle: 0
        });
        this.physics.addBody(this.ship);

        // カメラ設定
        this.camera.follow(this.ship);
        this.camera.setZoom(0.5);
    }

    /**
     * ゲーム開始
     */
    start() {
        if (!this.sun) {
            this.init();
        }
        this.running = true;
        this.gameOver = false;
        this.lastTime = performance.now();
        this.loop();
    }

    /**
     * リセット
     */
    reset() {
        this.physics.clearBodies();
        this.sun = null;
        this.planets = [];
        this.ship = null;
        this.timeScaleIndex = 0;
        this.timeScale = TIME_SCALES[this.timeScaleIndex];
        this.init();
    }

    /**
     * 入力処理
     */
    handleInput(dt) {
        if (this.gameOver) return;

        // 回転
        if (this.input.isKeyDown('ArrowLeft') || this.input.isKeyDown('a')) {
            this.ship.rotate(-1);
        }
        if (this.input.isKeyDown('ArrowRight') || this.input.isKeyDown('d')) {
            this.ship.rotate(1);
        }

        // 推力
        if (this.input.isKeyDown('ArrowUp') || this.input.isKeyDown('w') || this.input.isKeyDown(' ')) {
            this.ship.applyThrust(dt);
        } else {
            this.ship.thrusting = false;
        }

        // 時間倍率切替
        if (this.input.isKeyPressed('t') || this.input.isKeyPressed('T')) {
            this.timeScaleIndex = (this.timeScaleIndex + 1) % TIME_SCALES.length;
            this.timeScale = TIME_SCALES[this.timeScaleIndex];
        }

        // リセット
        if (this.input.isKeyPressed('r') || this.input.isKeyPressed('R')) {
            this.reset();
        }

        // ズーム（マウスホイールの代わりにキー）
        if (this.input.isKeyDown('z')) {
            this.camera.zoomIn(0.01);
        }
        if (this.input.isKeyDown('x')) {
            this.camera.zoomOut(0.01);
        }
    }

    /**
     * 更新
     */
    update(dt) {
        if (this.gameOver) return;

        // 惑星の軌道更新
        for (const planet of this.planets) {
            planet.updateOrbit(dt, this.sun);
        }

        // 物理更新
        this.physics.update(dt);

        // 衝突判定
        const collision = this.physics.checkCollisionWith(this.ship);
        if (collision) {
            this.handleCollision(collision);
        }

        // カメラ更新
        this.camera.update();
    }

    /**
     * 衝突処理
     */
    handleCollision(planet) {
        const velocity = this.ship.velocity.length();
        const altitude = planet.getAltitude(this.ship.position);

        // 着陸判定
        if (velocity < LANDING.maxVelocity && altitude < 10) {
            this.endGame(true, planet);
        } else {
            this.endGame(false, planet);
        }
    }

    /**
     * ゲーム終了
     */
    endGame(success, planet) {
        this.gameOver = true;
        this.running = false;

        const gameOverDiv = document.getElementById('game-over');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');

        if (success) {
            gameOverDiv.classList.add('success');
            resultTitle.textContent = '着陸成功！';
            resultMessage.textContent = `${planet.name}への着陸に成功しました！`;
        } else {
            gameOverDiv.classList.remove('success');
            resultTitle.textContent = '墜落...';
            resultMessage.textContent = `${planet.name}に激突しました。速度が速すぎました。`;
        }

        gameOverDiv.classList.remove('hidden');
    }

    /**
     * HUD更新
     */
    updateHUD() {
        document.getElementById('velocity').textContent =
            `${this.ship.velocity.length().toFixed(1)} m/s`;

        // 最も近い惑星からの高度
        let minAltitude = Infinity;
        for (const planet of this.planets) {
            const altitude = planet.getAltitude(this.ship.position);
            if (altitude < minAltitude) {
                minAltitude = altitude;
            }
        }
        document.getElementById('altitude').textContent =
            `${(minAltitude / 10).toFixed(1)} km`;

        document.getElementById('fuel').textContent =
            `${this.ship.getFuelPercent().toFixed(0)}%`;

        document.getElementById('timescale').textContent =
            `${this.timeScale}x`;
    }

    /**
     * 描画
     */
    render() {
        this.renderer.clear();
        this.renderer.drawBodies([this.sun, ...this.planets, this.ship], this.camera);
    }

    /**
     * ゲームループ
     */
    loop() {
        if (!this.running) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000; // 秒に変換
        this.lastTime = currentTime;

        // 時間倍率を適用
        const dt = deltaTime * this.timeScale;

        this.handleInput(dt);
        this.update(dt);
        this.render();
        this.updateHUD();

        this.input.update();

        requestAnimationFrame(() => this.loop());
    }
}

// ゲーム起動
const game = new Game();
