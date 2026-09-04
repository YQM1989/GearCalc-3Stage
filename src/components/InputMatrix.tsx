import type { GearCalcInput, StageCount, StageInput } from "../types/gear";

interface InputMatrixProps {
  input: GearCalcInput;
  onMotorRpmChange: (value: number) => void;
  onMotorTorqueChange: (value: number) => void;
  onDefaultEfficiencyChange: (value: number) => void;
  onStageCountChange: (value: StageCount) => void;
  onStageChange: (index: number, stage: StageInput) => void;
}

const NumberField = ({
  label,
  unit,
  value,
  min,
  max,
  step,
  disabled = false,
  compact = false,
  onChange,
}: {
  label: string;
  unit?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  compact?: boolean;
  onChange: (value: number) => void;
}) => (
  <label className={compact ? "grid min-w-0 gap-1" : "grid grid-cols-[112px_minmax(0,1fr)] items-center gap-2"}>
    <span className="truncate text-xs font-medium text-slate-600">{label}</span>
    <div className="flex min-w-0 overflow-hidden rounded border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/10">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`min-w-0 flex-1 bg-white px-2 text-sm font-semibold text-slate-950 outline-none disabled:bg-slate-100 disabled:text-slate-500 ${
          compact ? "h-8" : "h-9"
        }`}
      />
      {unit ? (
        <span className="flex min-w-10 shrink-0 items-center justify-center border-l border-slate-200 bg-slate-50 px-1 text-[10px] font-semibold text-slate-500">
          {unit}
        </span>
      ) : null}
    </div>
  </label>
);

export const InputMatrix = ({
  input,
  onMotorRpmChange,
  onMotorTorqueChange,
  onDefaultEfficiencyChange,
  onStageCountChange,
  onStageChange,
}: InputMatrixProps) => {
  const updateStage = (index: number, patch: Partial<StageInput>) => {
    onStageChange(index, { ...input.stages[index], ...patch });
  };

  return (
    <section className="min-h-full bg-[#fbfcfc]">
      <div className="flex h-12 items-center border-b border-slate-200 px-4">
        <h2 className="border-l-[3px] border-blue-600 pl-2 text-sm font-semibold text-slate-950">输入参数</h2>
      </div>

      <div className="px-4 py-3">
        <div className="mb-2 text-sm font-semibold text-slate-900">电机参数</div>
        <div className="grid gap-2">
          <NumberField label="电机转速" unit="rpm" min={0} step={1} value={input.motorRpm} onChange={onMotorRpmChange} />
          <NumberField label="电机扭矩" unit="N·m" min={0} step={0.01} value={input.motorTorque} onChange={onMotorTorqueChange} />
          <NumberField label="默认效率" unit="%" min={0} max={100} step={0.1} value={input.defaultEfficiency} onChange={onDefaultEfficiencyChange} />
          <NumberField label="压力角（固定）" unit="deg" value={input.pressureAngle} disabled onChange={() => undefined} />
        </div>

        <div className="mt-4">
          <div className="mb-2 text-sm font-semibold text-slate-900">级数</div>
          <div className="grid grid-cols-3 overflow-hidden rounded border border-slate-300 bg-white">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                className={`h-9 border-r border-slate-300 text-sm font-semibold transition last:border-r-0 ${
                  input.stageCount === count
                    ? "bg-blue-700 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
                onClick={() => onStageCountChange(count as StageCount)}
                aria-pressed={input.stageCount === count}
              >
                {count} 级
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          {input.stages.map((stage, index) => {
            const disabled = index >= input.stageCount;

            return (
              <section
                key={index}
                className={`rounded border px-3 py-2.5 ${
                  disabled ? "border-slate-200 bg-slate-100/70 opacity-60" : "border-slate-300 bg-white"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-950">第 {index + 1} 级</h3>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span className={`h-2 w-2 rounded-full ${disabled ? "bg-slate-400" : "bg-emerald-700"}`} />
                    {disabled ? "未启用" : "正常"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <NumberField compact label="模数 m" value={stage.module} min={0.1} step={0.1} disabled={disabled} onChange={(value) => updateStage(index, { module: value })} />
                  <NumberField compact label="主动齿数" value={stage.driverTeeth} min={1} step={1} disabled={disabled} onChange={(value) => updateStage(index, { driverTeeth: value })} />
                  <NumberField compact label="从动齿数" value={stage.drivenTeeth} min={1} step={1} disabled={disabled} onChange={(value) => updateStage(index, { drivenTeeth: value })} />
                  <NumberField compact label="效率 %" value={stage.efficiency} min={0} max={100} step={0.1} disabled={disabled} onChange={(value) => updateStage(index, { efficiency: value })} />
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] leading-5 text-slate-500">
          效率为各级单对齿轮效率；齿形按标准 20° 压力角作工程示意。
        </p>
      </div>
    </section>
  );
};
