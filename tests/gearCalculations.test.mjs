import assert from "node:assert/strict";
import test from "node:test";

import { calculateGearReduction } from "../src/lib/gearCalculations.ts";

const closeTo = (actual, expected, tolerance = 1e-10) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
};

test("calculates an explainable two-stage reduction", () => {
  const result = calculateGearReduction({
    stageCount: 2,
    motorRpm: 1450,
    motorTorque: 0.5,
    defaultEfficiency: 95,
    pressureAngle: 20,
    stages: [
      { module: 1, driverTeeth: 20, drivenTeeth: 60, efficiency: 95 },
      { module: 1.5, driverTeeth: 18, drivenTeeth: 72, efficiency: 94 },
    ],
  });

  assert.equal(result.totalRatio, 12);
  closeTo(result.outputRpm, 1450 / 12);
  closeTo(result.outputTorque, 0.5 * 12 * 0.95 * 0.94);
  closeTo(result.totalEfficiency, 0.95 * 0.94);
  assert.equal(result.outputDirection, "与电机同向");
  assert.deepEqual(
    result.stages.map((stage) => stage.centerDistance),
    [40, 67.5],
  );
  assert.equal(result.risks.length, 0);
});

test("reports the built-in example engineering risks", () => {
  const result = calculateGearReduction({
    stageCount: 3,
    motorRpm: 3000,
    motorTorque: 0.1,
    defaultEfficiency: 95,
    pressureAngle: 20,
    stages: [
      { module: 0.5, driverTeeth: 11, drivenTeeth: 69, efficiency: 95 },
      { module: 0.6, driverTeeth: 36, drivenTeeth: 57, efficiency: 95 },
      { module: 1, driverTeeth: 16, drivenTeeth: 96, efficiency: 95 },
    ],
  });

  closeTo(result.totalRatio, (69 / 11) * (57 / 36) * (96 / 16));
  closeTo(result.totalEfficiency, 0.95 ** 3);
  assert.deepEqual(
    result.risks.map((risk) => risk.id),
    ["low-teeth-0-主动齿轮", "low-teeth-2-主动齿轮", "three-stage-accumulation"],
  );
});

test("rejects fractional teeth and clamps efficiency above 100 percent", () => {
  const result = calculateGearReduction({
    stageCount: 1,
    motorRpm: 1500,
    motorTorque: 0.2,
    defaultEfficiency: 95,
    pressureAngle: 20,
    stages: [{ module: 1, driverTeeth: 20.5, drivenTeeth: 40, efficiency: 120 }],
  });

  assert.equal(result.totalRatio, 0);
  assert.equal(result.outputRpm, 0);
  assert.equal(result.outputTorque, 0);
  assert.equal(result.stages[0].efficiency, 100);
  assert.equal(result.stages[0].centerDistance, 0);
  assert.deepEqual(
    result.risks.filter((risk) => risk.severity === "error").map((risk) => risk.id),
    ["invalid-teeth-0-driver", "invalid-efficiency-0"],
  );
});

test("rejects unsupported pressure angles", () => {
  const result = calculateGearReduction({
    stageCount: 1,
    motorRpm: 1500,
    motorTorque: 0.2,
    defaultEfficiency: 95,
    pressureAngle: 25,
    stages: [{ module: 1, driverTeeth: 20, drivenTeeth: 40, efficiency: 95 }],
  });

  assert.ok(result.risks.some((risk) => risk.id === "unsupported-pressure-angle"));
});
