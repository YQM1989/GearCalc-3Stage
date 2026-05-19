import type { GearCalculationResult } from "../types/gear";

interface ResultSummaryProps {
  result: GearCalculationResult;
}

const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

const SummaryMetric = ({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) => (
  <div className={`rounded-lg border p-4 ${highlight ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white"}`}>
    <div className="text-sm font-medium text-slate-500">{label}</div>
    <div className="mt-2 flex items-baseline gap-1.5">
      <span className="text-2xl font-bold text-slate-950">{value}</span>
      {unit ? <span className="text-sm font-semibold text-slate-500">{unit}</span> : null}
    </div>
  </div>
);

export const ResultSummary = ({ result }: ResultSummaryProps) => (
  <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
    <div className="mb-5">
      <h2 className="text-base font-semibold text-slate-950">结果总览</h2>
      <p className="mt-1 text-sm text-slate-500">所有结果随输入实时更新。</p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <SummaryMetric
        label="总减速比"
        value={formatNumber(result.totalRatio)}
        highlight
      />
      <SummaryMetric
        label="输出转速"
        value={formatNumber(result.outputRpm, 1)}
        unit="rpm"
      />
      <SummaryMetric
        label="输出扭矩"
        value={formatNumber(result.outputTorque, 2)}
        unit="N·m"
      />
      <SummaryMetric
        label="总效率"
        value={formatNumber(result.totalEfficiency * 100, 1)}
        unit="%"
      />
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="text-sm font-medium text-slate-500">输出方向</div>
        <div className="mt-2 text-xl font-bold text-slate-950">{result.outputDirection}</div>
      </div>
    </div>
  </aside>
);
