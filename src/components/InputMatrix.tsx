import type { GearCalcInput, StageCount, StageInput } from "../types/gear";

interface InputMatrixProps {
  input: GearCalcInput;
  onMotorRpmChange: (value: number) => void;
  onMotorTorqueChange: (value: number) => void;
  onDefaultEfficiencyChange: (value: number) => void;
  onStageCountChange: (value: StageCount) => void;
  onStageChange: (index: number, stage: StageInput) => void;
}

const CompactNumberField = ({
  label,
  unit,
  value,
  min,
  max,
  step,
  disabled = false,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) => (
  <label className="grid min-w-0 gap-1">
    <span className="truncate text-xs font-medium text-slate-600">{label}</span>
    <div className="flex min-w-0 overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-w-0 flex-1 px-2 py-1.5 text-sm font-semibold text-slate-950 outline-none disabled:bg-slate-100 disabled:text-slate-500"
      />
      <span className="flex w-10 shrink-0 items-center justify-center border-l border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-500">
        {unit}
      </span>
    </div>
  </label>
);

const StageNumberInput = ({
  ariaLabel,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  ariaLabel: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) => (
  <input
    className="min-w-0 rounded border border-slate-300 bg-white px-2 py-1.5 text-sm font-semibold text-slate-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 disabled:bg-slate-100 disabled:text-slate-400"
    type="number"
    aria-label={ariaLabel}
    min={min}
    max={max}
    step={step}
    value={value}
    disabled={disabled}
    onChange={(event) => onChange(Number(event.target.value))}
  />
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
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-3 py-2">
        <h2 className="text-sm font-semibold text-slate-950">输入参数</h2>
      </div>

      <div className="grid gap-3 p-3">
        <div className="grid grid-cols-2 gap-2">
          <CompactNumberField
            label="电机转速"
            unit="rpm"
            min={0}
            step={1}
            value={input.motorRpm}
            onChange={onMotorRpmChange}
          />
          <CompactNumberField
            label="电机扭矩"
            unit="N·m"
            min={0}
            step={0.01}
            value={input.motorTorque}
            onChange={onMotorTorqueChange}
          />
          <CompactNumberField
            label="默认效率"
            unit="%"
            min={0}
            max={100}
            step={0.1}
            value={input.defaultEfficiency}
            onChange={onDefaultEfficiencyChange}
          />
          <CompactNumberField
            label="压力角（首版固定）"
            unit="deg"
            value={input.pressureAngle}
            disabled
            onChange={() => undefined}
          />
        </div>

        <div>
          <div className="mb-1 text-xs font-medium text-slate-600">级数</div>
          <div className="grid grid-cols-3 rounded-md border border-slate-300 bg-slate-50 p-1">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
                  input.stageCount === count
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-950"
                }`}
                onClick={() => onStageCountChange(count as StageCount)}
                aria-pressed={input.stageCount === count}
              >
                {count} 级
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-[38px_repeat(4,minmax(0,1fr))_1.15fr] gap-1 bg-slate-50 px-2 py-2 text-[11px] font-semibold text-slate-500">
            <div>级</div>
            <div>模数</div>
            <div>主动齿</div>
            <div>从动齿</div>
            <div>效率</div>
            <div>备注</div>
          </div>
          <div className="divide-y divide-slate-100">
            {input.stages.map((stage, index) => {
              const disabled = index >= input.stageCount;

              return (
                <div
                  key={index}
                  className={`grid grid-cols-[38px_repeat(4,minmax(0,1fr))_1.15fr] gap-1 px-2 py-2 ${
                    disabled ? "bg-slate-50/70" : "bg-white"
                  }`}
                >
                  <div className="flex items-center text-sm font-bold text-slate-800">{index + 1}</div>
                  <StageNumberInput
                    ariaLabel={`第 ${index + 1} 级模数`}
                    value={stage.module}
                    min={0.1}
                    step={0.1}
                    disabled={disabled}
                    onChange={(value) => updateStage(index, { module: value })}
                  />
                  <StageNumberInput
                    ariaLabel={`第 ${index + 1} 级主动齿轮齿数`}
                    value={stage.driverTeeth}
                    min={1}
                    step={1}
                    disabled={disabled}
                    onChange={(value) => updateStage(index, { driverTeeth: value })}
                  />
                  <StageNumberInput
                    ariaLabel={`第 ${index + 1} 级从动齿轮齿数`}
                    value={stage.drivenTeeth}
                    min={1}
                    step={1}
                    disabled={disabled}
                    onChange={(value) => updateStage(index, { drivenTeeth: value })}
                  />
                  <StageNumberInput
                    ariaLabel={`第 ${index + 1} 级效率`}
                    value={stage.efficiency}
                    min={0}
                    max={100}
                    step={0.1}
                    disabled={disabled}
                    onChange={(value) => updateStage(index, { efficiency: value })}
                  />
                  <input
                    aria-label={`第 ${index + 1} 级备注`}
                    className="min-w-0 rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 disabled:bg-slate-100 disabled:text-slate-400"
                    value={stage.note ?? ""}
                    disabled={disabled}
                    onChange={(event) => updateStage(index, { note: event.target.value })}
                    placeholder="可选"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
