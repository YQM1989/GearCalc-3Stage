import { useMemo, useState } from "react";
import { GearDimensionTable } from "./components/GearDimensionTable";
import { MotorInputPanel } from "./components/MotorInputPanel";
import { ResultSummary } from "./components/ResultSummary";
import { RiskWarnings } from "./components/RiskWarnings";
import { StageInputCard } from "./components/StageInputCard";
import { StageResultTable } from "./components/StageResultTable";
import { calculateGearReduction } from "./lib/gearCalculations";
import type { GearCalcInput, StageCount, StageInput } from "./types/gear";

const createStage = (efficiency = 95): StageInput => ({
  module: 1,
  driverTeeth: 20,
  drivenTeeth: 40,
  efficiency,
  note: "",
});

const defaultInput: GearCalcInput = {
  stageCount: 1,
  motorRpm: 1500,
  motorTorque: 0.2,
  defaultEfficiency: 95,
  pressureAngle: 20,
  stages: [createStage(), createStage(), createStage()],
};

const exampleInput: GearCalcInput = {
  stageCount: 3,
  motorRpm: 3000,
  motorTorque: 0.1,
  defaultEfficiency: 95,
  pressureAngle: 20,
  stages: [
    { module: 0.5, driverTeeth: 11, drivenTeeth: 69, efficiency: 95, note: "" },
    { module: 0.6, driverTeeth: 36, drivenTeeth: 57, efficiency: 95, note: "" },
    { module: 1, driverTeeth: 16, drivenTeeth: 96, efficiency: 95, note: "" },
  ],
};

const cloneInput = (input: GearCalcInput): GearCalcInput => ({
  ...input,
  stages: input.stages.map((stage) => ({ ...stage })),
});

function App() {
  const [input, setInput] = useState<GearCalcInput>(() => cloneInput(defaultInput));
  const result = useMemo(() => calculateGearReduction(input), [input]);

  const updateStage = (index: number, stage: StageInput) => {
    setInput((current) => ({
      ...current,
      stages: current.stages.map((item, itemIndex) => (itemIndex === index ? stage : item)),
    }));
  };

  const updateDefaultEfficiency = (value: number) => {
    setInput((current) => ({
      ...current,
      defaultEfficiency: value,
      stages: current.stages.map((stage) => ({ ...stage, efficiency: value })),
    }));
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">GearCalc-3Stage</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal text-slate-950">
              三级齿轮减速参数计算器
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
              onClick={() => setInput(cloneInput(exampleInput))}
            >
              载入示例
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-950"
              onClick={() => setInput(cloneInput(defaultInput))}
            >
              重置
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-5">
            <MotorInputPanel
              motorRpm={input.motorRpm}
              motorTorque={input.motorTorque}
              defaultEfficiency={input.defaultEfficiency}
              pressureAngle={input.pressureAngle}
              stageCount={input.stageCount}
              onMotorRpmChange={(value) => setInput((current) => ({ ...current, motorRpm: value }))}
              onMotorTorqueChange={(value) =>
                setInput((current) => ({ ...current, motorTorque: value }))
              }
              onDefaultEfficiencyChange={updateDefaultEfficiency}
              onPressureAngleChange={(value) =>
                setInput((current) => ({ ...current, pressureAngle: value }))
              }
              onStageCountChange={(value: StageCount) =>
                setInput((current) => ({ ...current, stageCount: value }))
              }
            />

            <div className="grid gap-5">
              {input.stages.slice(0, input.stageCount).map((stage, index) => (
                <StageInputCard
                  key={index}
                  stage={stage}
                  index={index}
                  onChange={(nextStage) => updateStage(index, nextStage)}
                />
              ))}
            </div>
          </div>

          <ResultSummary result={result} />
        </div>

        <div className="mt-6 grid gap-6">
          <StageResultTable stages={result.stages} />
          <GearDimensionTable gears={result.gears} />
          <RiskWarnings risks={result.risks} />
        </div>
      </div>
    </main>
  );
}

export default App;
