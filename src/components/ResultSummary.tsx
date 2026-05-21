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
  <div
    className={`rounded-md border px-3 py-2 ${
      highlight ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white"
    }`}
  >
    <div className="text-xs font-medium text-slate-500">{label}</div>
    <div className="mt-1 flex items-baseline gap-1.5">
      <span className="text-lg font-bold text-slate-950">{value}</span>
      {unit ? <span className="text-xs font-semibold text-slate-500">{unit}</span> : null}
    </div>
  </div>
);

export const ResultSummary = ({ result }: ResultSummaryProps) => (
  <section className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
    <div className="grid grid-cols-[120px_repeat(5,minmax(0,1fr))] items-stretch gap-2">
      <div className="flex flex-col justify-center rounded-md bg-slate-50 px-3 py-2">
        <h2 className="text-sm font-semibold text-slate-950">结果总览</h2>
        <p className="mt-0.5 text-xs text-slate-500">实时更新</p>
      </div>
      <SummaryMetric label="总减速比" value={formatNumber(result.totalRatio)} highlight />
      <SummaryMetric label="输出转速" value={formatNumber(result.outputRpm, 1)} unit="rpm" />
      <SummaryMetric label="输出扭矩" value={formatNumber(result.outputTorque, 2)} unit="N·m" />
      <SummaryMetric label="总效率" value={formatNumber(result.totalEfficiency * 100, 1)} unit="%" />
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
        <div className="text-xs font-medium text-slate-500">输出方向</div>
        <div className="mt-1 text-lg font-bold text-slate-950">{result.outputDirection}</div>
      </div>
    </div>
  </section>
);
