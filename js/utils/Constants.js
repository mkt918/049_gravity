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
        radius: 40, // 表示用半径（ピクセル）
        color: '#FDB813',
        glowColor: '#FF6B00'
    },
    mercury: {
        name: '水星',
        mass: 3.285e23,
        radius: 6,
        color: '#8C7853',
        orbitRadius: 180, // ゲーム内軌道半径（ピクセル）
        orbitSpeed: 0.0004, // 軌道速度（rad/frame）
        atmosphereHeight: 0 // 大気圏の高さ（km）
    },
    venus: {
        name: '金星',
        mass: 4.867e24,
        radius: 12,
        color: '#FFC649',
        orbitRadius: 260,
        orbitSpeed: 0.0003,
        atmosphereHeight: 250
    },
    earth: {
        name: '地球',
        mass: 5.972e24,
        radius: 13,
        color: '#4A90E2',
        orbitRadius: 340,
        orbitSpeed: 0.00025,
        atmosphereHeight: 100
    },
    mars: {
        name: '火星',
        mass: 6.39e23,
        radius: 9,
        color: '#E27B58',
        orbitRadius: 420,
        orbitSpeed: 0.0002,
        atmosphereHeight: 50
    },
    jupiter: {
        name: '木星',
        mass: 1.898e27,
        radius: 28,
        color: '#C88B3A',
        orbitRadius: 580,
        orbitSpeed: 0.00012,
        atmosphereHeight: 500
    },
    saturn: {
        name: '土星',
        mass: 5.683e26,
        radius: 24,
        color: '#FAD5A5',
        orbitRadius: 740,
        orbitSpeed: 0.0001,
        atmosphereHeight: 400,
        hasRings: true
    },
    uranus: {
        name: '天王星',
        mass: 8.681e25,
        radius: 18,
        color: '#4FD0E0',
        orbitRadius: 900,
        orbitSpeed: 0.00008,
        atmosphereHeight: 300
    },
    neptune: {
        name: '海王星',
        mass: 1.024e26,
        radius: 17,
        color: '#4166F5',
        orbitRadius: 1060,
        orbitSpeed: 0.00006,
        atmosphereHeight: 300
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
