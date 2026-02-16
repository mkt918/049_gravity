/**
 * ゲーム定数
 */

// 物理定数
export const G = 6.674e-11; // 万有引力定数（実際の値）
export const GAME_G = 100; // ゲーム用の重力定数（調整済み）

// 時間倍率
export const TIME_SCALES = [1, 10, 100, 1000, 10000];

// 太陽系データ（ゲームスケール調整済み）
export const CELESTIAL_BODIES = {
    sun: {
        name: '太陽',
        mass: 1.989e30,
        radius: 30, // 表示用半径（ピクセル）
        color: '#FDB813',
        glowColor: '#FF6B00'
    },
    mercury: {
        name: '水星',
        mass: 3.285e23,
        radius: 8,
        color: '#8C7853',
        orbitRadius: 200, // ゲーム内軌道半径（ピクセル）
        orbitSpeed: 0.0002, // 軌道速度（rad/frame）
        atmosphereHeight: 0 // 大気圏の高さ（km）
    },
    venus: {
        name: '金星',
        mass: 4.867e24,
        radius: 12,
        color: '#FFC649',
        orbitRadius: 300,
        orbitSpeed: 0.00015,
        atmosphereHeight: 250
    },
    earth: {
        name: '地球',
        mass: 5.972e24,
        radius: 13,
        color: '#4A90E2',
        orbitRadius: 400,
        orbitSpeed: 0.0001,
        atmosphereHeight: 100
    },
    mars: {
        name: '火星',
        mass: 6.39e23,
        radius: 10,
        color: '#E27B58',
        orbitRadius: 500,
        orbitSpeed: 0.00008,
        atmosphereHeight: 50
    }
};

// 宇宙船データ
export const SHIP = {
    mass: 1000, // kg
    fuel: 1000, // kg
    maxThrust: 50000, // N
    fuelConsumption: 0.5, // kg/s
    radius: 5, // 表示用半径
    color: '#FFFFFF',
    thrustColor: '#FF4500'
};

// 着陸判定
export const LANDING = {
    maxVelocity: 5, // 着陸可能な最大速度（m/s）
    maxAngle: Math.PI / 6 // 着陸可能な最大角度（30度）
};

// 表示設定
export const DISPLAY = {
    minZoom: 0.1,
    maxZoom: 10,
    zoomSpeed: 0.1,
    trailLength: 100 // 軌跡の長さ
};
