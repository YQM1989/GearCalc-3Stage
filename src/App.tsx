import { useMemo, useState } from "react";
import { GearDimensionTable } from "./components/GearDimensionTable";
import { GearTrainPreview } from "./components/GearTrainPreview";
import { InputMatrix } from "./components/InputMatrix";
import { ResultSummary } from "./components/ResultSummary";
import { RiskWarnings } from "./components/RiskWarnings";
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
    <main className="h-screen min-w-[1280px] overflow-hidden bg-slate-100">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col px-3 py-3">
        <header className="mb-3 flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <p className="text-xs font-semibold text-teal-700">GearCalc-3Stage</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-normal text-slate-950">
              三级齿轮减速参数计算器
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
              onClick={() => setInput(cloneInput(exampleInput))}
            >
              载入示例
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-950"
              onClick={() => setInput(cloneInput(defaultInput))}
            >
              重置
            </button>
          </div>
        </header>

        <ResultSummary result={result} />

        <div className="mt-3 grid min-h-0 flex-1 grid-cols-[430px_minmax(0,1fr)] gap-3">
          <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
            <InputMatrix
              input={input}
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
              onStageChange={updateStage}
            />
            <div className="min-h-0 overflow-y-auto overscroll-contain pr-1">
              <RiskWarnings risks={result.risks} />
            </div>
          </div>

          <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
            <GearTrainPreview stages={input.stages.slice(0, input.stageCount)} result={result} />
            <div className="grid min-h-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3">
              <div className="min-h-0 overflow-auto overscroll-contain">
                <StageResultTable stages={result.stages} />
              </div>
              <div className="min-h-0 overflow-auto overscroll-contain">
                <GearDimensionTable gears={result.gears} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
