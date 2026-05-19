import type { StageInput } from "../types/gear";

interface StageInputCardProps {
  stage: StageInput;
  index: number;
  onChange: (stage: StageInput) => void;
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
      <span className="flex min-w-12 items-center justify-center rounded-r-md border-l border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-500">
        {unit}
      </span>
    </div>
  </label>
);

export const StageInputCard = ({ stage, index, onChange }: StageInputCardProps) => {
  const updateStage = (patch: Partial<StageInput>) => onChange({ ...stage, ...patch });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-950">第 {index + 1} 级齿轮参数</h2>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          外啮合
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="模数"
          unit="mm"
          min={0}
          step={0.1}
          value={stage.module}
          onChange={(value) => updateStage({ module: value })}
        />
        <NumberField
          label="本级效率"
          unit="%"
          min={0}
          step={0.1}
          value={stage.efficiency}
          onChange={(value) => updateStage({ efficiency: value })}
        />
        <NumberField
          label="主动齿轮齿数"
          unit="齿"
          min={0}
          step={1}
          value={stage.driverTeeth}
          onChange={(value) => updateStage({ driverTeeth: value })}
        />
        <NumberField
          label="从动齿轮齿数"
          unit="齿"
          min={0}
          step={1}
          value={stage.drivenTeeth}
          onChange={(value) => updateStage({ drivenTeeth: value })}
        />
      </div>

      <label className="mt-4 grid gap-1.5">
        <span className="text-sm font-medium text-slate-700">备注</span>
        <textarea
          className="min-h-20 resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
          value={stage.note ?? ""}
          onChange={(event) => updateStage({ note: event.target.value })}
          placeholder="可选"
        />
      </label>
    </section>
  );
};
