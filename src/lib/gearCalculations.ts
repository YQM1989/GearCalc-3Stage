import type {
  GearCalcInput,
  GearCalculationResult,
  GearGeometry,
  RiskWarning,
  StageCalculation,
  StageInput,
} from "../types/gear";

const clampStageCount = (value: number): 1 | 2 | 3 => {
  if (value <= 1) return 1;
  if (value >= 3) return 3;
  return 2;
};

const positiveOrZero = (value: number) =>
  Number.isFinite(value) && value > 0 ? value : 0;

const percentToFactor = (value: number) =>
  Number.isFinite(value) ? Math.max(value, 0) / 100 : 0;

const calculateGearGeometry = (
  stageIndex: number,
  role: GearGeometry["role"],
  stage: StageInput,
  teeth: number,
): GearGeometry => {
  const moduleValue = positiveOrZero(stage.module);
  const teethValue = positiveOrZero(teeth);

  return {
    stageIndex,
    role,
    module: moduleValue,
    teeth: teethValue,
    pitchDiameter: moduleValue * teethValue,
    addendumDiameter: moduleValue * teethValue + 2 * moduleValue,
    rootDiameter: moduleValue * teethValue - 2.5 * moduleValue,
    circularPitch: Math.PI * moduleValue,
  };
};

const buildRiskWarnings = (
  activeStages: StageInput[],
  stageResults: StageCalculation[],
): RiskWarning[] => {
  const risks: RiskWarning[] = [];

  activeStages.forEach((stage, stageIndex) => {
    const lowToothGears = [
      { role: "主动齿轮", teeth: stage.driverTeeth },
      { role: "从动齿轮", teeth: stage.drivenTeeth },
    ].filter((gear) => Number.isFinite(gear.teeth) && gear.teeth > 0 && gear.teeth < 17);

    lowToothGears.forEach((gear) => {
      risks.push({
        id: `low-teeth-${stageIndex}-${gear.role}`,
        message:
          "齿数偏少：标准 20° 直齿轮可能存在根切风险，建议检查是否需要变位设计。",
        detail: `第 ${stageIndex + 1} 级 ${gear.role} 为 ${gear.teeth} 齿。`,
      });
    });

    const stageResult = stageResults[stageIndex];

    if (stageResult.ratio > 8) {
      risks.push({
        id: `large-ratio-${stageIndex}`,
        message:
          "单级减速比较大：可能导致齿轮尺寸、啮合压力、噪音和寿命问题。",
        detail: `第 ${stageIndex + 1} 级减速比为 ${stageResult.ratio.toFixed(2)}。`,
      });
    }

    if (positiveOrZero(stage.module) <= 0.5 && stageResult.outputTorque >= 1) {
      risks.push({
        id: `small-module-high-torque-${stageIndex}`,
        message:
          "模数偏小且扭矩较高，建议结合齿宽、材料、热处理和实际载荷做强度校核。",
        detail: `第 ${stageIndex + 1} 级模数 ${stage.module} mm，输出扭矩 ${stageResult.outputTorque.toFixed(
          2,
        )} N·m。`,
      });
    }

    if (stageResult.centerDistance > 0 && stageResult.centerDistance < 10) {
      risks.push({
        id: `small-center-distance-${stageIndex}`,
        message:
          "中心距较小，请检查齿轮尺寸、轴径、轴承空间和装配可行性。",
        detail: `第 ${stageIndex + 1} 级中心距为 ${stageResult.centerDistance.toFixed(2)} mm。`,
      });
    }
  });

  if (activeStages.length === 3) {
    risks.push({
      id: "three-stage-accumulation",
      message:
        "三级减速会累计效率损失、齿隙、噪音和装配误差，应关注轴距精度、同轴度、润滑和材料强度。",
    });
  }

  return risks;
};

export const calculateGearReduction = (
  input: GearCalcInput,
): GearCalculationResult => {
  const stageCount = clampStageCount(input.stageCount);
  const activeStages = input.stages.slice(0, stageCount);

  let currentRpm = positiveOrZero(input.motorRpm);
  let currentTorque = positiveOrZero(input.motorTorque);
  let totalRatio = 1;
  let totalEfficiency = 1;

  const stages: StageCalculation[] = [];
  const gears: GearGeometry[] = [];

  activeStages.forEach((stage, index) => {
    const moduleValue = positiveOrZero(stage.module);
    const driverTeeth = positiveOrZero(stage.driverTeeth);
    const drivenTeeth = positiveOrZero(stage.drivenTeeth);
    const ratio = driverTeeth > 0 ? drivenTeeth / driverTeeth : 0;
    const efficiencyPercent = Number.isFinite(stage.efficiency)
      ? stage.efficiency
      : input.defaultEfficiency;
    const efficiency = percentToFactor(efficiencyPercent);
    const outputRpm = ratio > 0 ? currentRpm / ratio : 0;
    const outputTorque = ratio > 0 ? currentTorque * ratio * efficiency : 0;
    const centerDistance = moduleValue * (driverTeeth + drivenTeeth) / 2;

    totalRatio *= ratio > 0 ? ratio : 0;
    totalEfficiency *= efficiency;

    stages.push({
      stageIndex: index + 1,
      inputRpm: currentRpm,
      outputRpm,
      inputTorque: currentTorque,
      outputTorque,
      ratio,
      efficiency: efficiencyPercent,
      centerDistance,
      note: stage.note,
    });

    gears.push(
      calculateGearGeometry(index + 1, "主动齿轮", stage, stage.driverTeeth),
      calculateGearGeometry(index + 1, "从动齿轮", stage, stage.drivenTeeth),
    );

    currentRpm = outputRpm;
    currentTorque = outputTorque;
  });

  return {
    stages,
    gears,
    totalRatio,
    outputRpm: currentRpm,
    outputTorque: currentTorque,
    totalEfficiency,
    outputDirection: stageCount % 2 === 0 ? "与电机同向" : "与电机反向",
    risks: buildRiskWarnings(activeStages, stages),
  };
};
