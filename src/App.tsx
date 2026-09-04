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
    <main className="h-screen min-w-[1280px] overflow-hidden bg-[#f3f5f6]">
      <div className="mx-auto flex h-full max-w-[1680px] flex-col border-x border-slate-200 bg-white">
        <header className="flex h-16 shrink-0 items-center justify-between gap-5 border-b border-slate-300 bg-white px-5">
          <div className="flex items-center gap-8">
            <h1 className="text-[23px] font-bold tracking-tight text-slate-950">
              三级齿轮减速参数计算器
            </h1>
            <div className="hidden items-center gap-5 border-l border-slate-200 pl-7 text-sm text-slate-600 xl:flex">
              <span>参数方案</span>
              <span>计算校核</span>
              <span>工程视图</span>
              <span className="border-l border-slate-200 pl-5">单位：SI</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              onClick={() => setInput(cloneInput(exampleInput))}
            >
              载入示例
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              onClick={() => setInput(cloneInput(defaultInput))}
            >
              重置
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_clamp(190px,23vh,242px)]">
          <div className="grid min-h-0 grid-cols-[clamp(300px,23.5vw,350px)_minmax(0,1fr)_clamp(240px,18vw,274px)] divide-x divide-slate-300">
            <aside className="min-h-0 overflow-y-auto bg-[#fbfcfc]">
              <InputMatrix
                input={input}
                onMotorRpmChange={(value) =>
                  setInput((current) => ({ ...current, motorRpm: value }))
                }
                onMotorTorqueChange={(value) =>
                  setInput((current) => ({ ...current, motorTorque: value }))
                }
                onDefaultEfficiencyChange={updateDefaultEfficiency}
                onStageCountChange={(value: StageCount) =>
                  setInput((current) => ({ ...current, stageCount: value }))
                }
                onStageChange={updateStage}
              />
            </aside>

            <div className="min-h-0 overflow-hidden">
              <GearTrainPreview stages={input.stages.slice(0, input.stageCount)} result={result} />
            </div>

            <aside className="min-h-0 overflow-y-auto bg-[#fbfcfc]">
              <ResultSummary result={result} />
              <RiskWarnings risks={result.risks} />
            </aside>
          </div>

          <div className="grid min-h-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] divide-x divide-slate-300 border-t border-slate-300 bg-white">
            <div className="min-h-0 overflow-auto">
              <StageResultTable stages={result.stages} />
            </div>
            <div className="min-h-0 overflow-auto">
              <GearDimensionTable gears={result.gears} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
