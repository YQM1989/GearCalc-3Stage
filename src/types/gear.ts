export type StageCount = 1 | 2 | 3;

export interface StageInput {
  module: number;
  driverTeeth: number;
  drivenTeeth: number;
  efficiency: number;
  note?: string;
}

export interface GearCalcInput {
  stageCount: StageCount;
  motorRpm: number;
  motorTorque: number;
  defaultEfficiency: number;
  pressureAngle: number;
  stages: StageInput[];
}

export interface GearGeometry {
  stageIndex: number;
  role: "主动齿轮" | "从动齿轮";
  module: number;
  teeth: number;
  pitchDiameter: number;
  addendumDiameter: number;
  rootDiameter: number;
  circularPitch: number;
}

export interface StageCalculation {
  stageIndex: number;
  inputRpm: number;
  outputRpm: number;
  inputTorque: number;
  outputTorque: number;
  ratio: number;
  efficiency: number;
  centerDistance: number;
  note?: string;
}

export interface RiskWarning {
  id: string;
  message: string;
  detail?: string;
}

export interface GearCalculationResult {
  stages: StageCalculation[];
  gears: GearGeometry[];
  totalRatio: number;
  outputRpm: number;
  outputTorque: number;
  totalEfficiency: number;
  outputDirection: "与电机同向" | "与电机反向";
  risks: RiskWarning[];
}
