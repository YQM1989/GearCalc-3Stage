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

const validTeethOrZero = (value: number) =>
  Number.isFinite(value) && Number.isInteger(value) && value > 0 ? value : 0;

const percentToFactor = (value: number) =>
  Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) / 100 : 0;

const calculateGearGeometry = (
  stageIndex: number,
  role: GearGeometry["role"],
  stage: StageInput,
  teeth: number,
): GearGeometry => {
  const moduleValue = positiveOrZero(stage.module);
  const teethValue = validTeethOrZero(teeth);

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

const buildInputWarnings = (
  input: GearCalcInput,
  activeStages: StageInput[],
): RiskWarning[] => {
  const warnings: RiskWarning[] = [];

  if (!Number.isFinite(input.motorRpm) || input.motorRpm <= 0) {
    warnings.push({
      id: "invalid-motor-rpm",
      severity: "error",
      message: "输入无效：电机转速必须大于 0。",
    });
  }

  if (!Number.isFinite(input.motorTorque) || input.motorTorque < 0) {
    warnings.push({
      id: "invalid-motor-torque",
      severity: "error",
      message: "输入无效：电机扭矩不能小于 0。",
    });
  }

  if (
    !Number.isFinite(input.defaultEfficiency) ||
    input.defaultEfficiency < 0 ||
    input.defaultEfficiency > 100
  ) {
    warnings.push({
      id: "invalid-default-efficiency",
      severity: "error",
      message: "输入无效：默认效率必须在 0% 到 100% 之间。",
    });
  }

  if (input.pressureAngle !== 20) {
    warnings.push({
      id: "unsupported-pressure-angle",
      severity: "error",
      message: "首版仅支持标准 20° 压力角。",
    });
  }

  activeStages.forEach((stage, stageIndex) => {
    const stageLabel = `第 ${stageIndex + 1} 级`;

    if (!Number.isFinite(stage.module) || stage.module <= 0) {
      warnings.push({
        id: `invalid-module-${stageIndex}`,
        severity: "error",
        message: `输入无效：${stageLabel}模数必须大于 0。`,
      });
    }

    [
      { key: "driver", label: "主动齿轮", value: stage.driverTeeth },
      { key: "driven", label: "从动齿轮", value: stage.drivenTeeth },
    ].forEach((gear) => {
      if (!Number.isFinite(gear.value) || !Number.isInteger(gear.value) || gear.value <= 0) {
        warnings.push({
          id: `invalid-teeth-${stageIndex}-${gear.key}`,
          severity: "error",
          message: `输入无效：${stageLabel}${gear.label}齿数必须是正整数。`,
        });
      }
    });

    if (!Number.isFinite(stage.efficiency) || stage.efficiency < 0 || stage.efficiency > 100) {
      warnings.push({
        id: `invalid-efficiency-${stageIndex}`,
        severity: "error",
        message: `输入无效：${stageLabel}效率必须在 0% 到 100% 之间。`,
      });
    }
  });

  return warnings;
};

const buildRiskWarnings = (
  input: GearCalcInput,
  activeStages: StageInput[],
  stageResults: StageCalculation[],
): RiskWarning[] => {
  const risks: RiskWarning[] = buildInputWarnings(input, activeStages);

  activeStages.forEach((stage, stageIndex) => {
    const lowToothGears = [
      { role: "主动齿轮", teeth: stage.driverTeeth },
      { role: "从动齿轮", teeth: stage.drivenTeeth },
    ].filter(
      (gear) =>
        Number.isFinite(gear.teeth) &&
        Number.isInteger(gear.teeth) &&
        gear.teeth > 0 &&
        gear.teeth < 17,
    );

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

    const moduleValue = positiveOrZero(stage.module);

    if (moduleValue > 0 && moduleValue <= 0.5 && stageResult.outputTorque >= 1) {
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
    const driverTeeth = validTeethOrZero(stage.driverTeeth);
    const drivenTeeth = validTeethOrZero(stage.drivenTeeth);
    const hasValidGearPair = driverTeeth > 0 && drivenTeeth > 0;
    const ratio = hasValidGearPair ? drivenTeeth / driverTeeth : 0;
    const rawEfficiency = Number.isFinite(stage.efficiency)
      ? stage.efficiency
      : input.defaultEfficiency;
    const efficiencyPercent = Number.isFinite(rawEfficiency)
      ? Math.min(Math.max(rawEfficiency, 0), 100)
      : 0;
    const efficiency = percentToFactor(efficiencyPercent);
    const outputRpm = ratio > 0 ? currentRpm / ratio : 0;
    const outputTorque = ratio > 0 ? currentTorque * ratio * efficiency : 0;
    const centerDistance = hasValidGearPair
      ? moduleValue * (driverTeeth + drivenTeeth) / 2
      : 0;

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
    risks: buildRiskWarnings(input, activeStages, stages),
  };
};
