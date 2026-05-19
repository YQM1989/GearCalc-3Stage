import type { StageCount } from "../types/gear";

interface MotorInputPanelProps {
  motorRpm: number;
  motorTorque: number;
  defaultEfficiency: number;
  pressureAngle: number;
  stageCount: StageCount;
  onMotorRpmChange: (value: number) => void;
  onMotorTorqueChange: (value: number) => void;
  onDefaultEfficiencyChange: (value: number) => void;
  onPressureAngleChange: (value: number) => void;
  onStageCountChange: (value: StageCount) => void;
}

const NumberField = ({
  label,
  unit,
  value,
  min,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
}) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <div className="flex rounded-md border border-slate-300 bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15">
      <input
        className="min-w-0 flex-1 rounded-l-md px-3 py-2 text-sm text-slate-900 outline-none"
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="flex min-w-14 items-center justify-center rounded-r-md border-l border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-500">
        {unit}
      </span>
    </div>
  </label>
);

export const MotorInputPanel = ({
  motorRpm,
  motorTorque,
  defaultEfficiency,
  pressureAngle,
  stageCount,
  onMotorRpmChange,
  onMotorTorqueChange,
  onDefaultEfficiencyChange,
  onPressureAngleChange,
  onStageCountChange,
}: MotorInputPanelProps) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-slate-950">电机参数</h2>
        <p className="mt-1 text-sm text-slate-500">压力角第一版仅用于显示。</p>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <NumberField
        label="电机转速"
        unit="rpm"
        min={0}
        step={1}
        value={motorRpm}
        onChange={onMotorRpmChange}
      />
      <NumberField
        label="电机扭矩"
        unit="N·m"
        min={0}
        step={0.01}
        value={motorTorque}
        onChange={onMotorTorqueChange}
      />
      <NumberField
        label="默认每级效率"
        unit="%"
        min={0}
        step={0.1}
        value={defaultEfficiency}
        onChange={onDefaultEfficiencyChange}
      />
      <NumberField
        label="压力角"
        unit="°"
        min={0}
        step={1}
        value={pressureAngle}
        onChange={onPressureAngleChange}
      />
    </div>

    <div className="mt-5">
      <span className="text-sm font-medium text-slate-700">级数选择</span>
      <div className="mt-2 grid grid-cols-3 rounded-md border border-slate-300 bg-slate-50 p-1">
        {[1, 2, 3].map((count) => (
          <button
            key={count}
            type="button"
            className={`rounded px-3 py-2 text-sm font-semibold transition ${
              stageCount === count
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-slate-950"
            }`}
            onClick={() => onStageCountChange(count as StageCount)}
          >
            {count} 级
          </button>
        ))}
      </div>
    </div>
  </section>
);
