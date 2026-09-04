import type { GearCalculationResult } from "../types/gear";

interface ResultSummaryProps {
  result: GearCalculationResult;
}

const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

const SummaryMetric = ({ label, symbol, value, unit }: { label: string; symbol: string; value: string; unit?: string }) => (
  <div className="border-b border-slate-200 py-3">
    <div className="text-xs font-medium text-slate-600">
      {label} <span className="ml-1 font-serif italic text-slate-500">{symbol}</span>
    </div>
    <div className="mt-1 flex items-baseline gap-1.5">
      <span className="text-[27px] font-bold leading-none tracking-tight text-slate-950">{value}</span>
      {unit ? <span className="text-sm font-semibold text-slate-500">{unit}</span> : null}
    </div>
  </div>
);

export const ResultSummary = ({ result }: ResultSummaryProps) => (
  <section className="px-4">
    <div className="flex h-12 items-center border-b border-slate-200">
      <h2 className="border-l-[3px] border-blue-600 pl-2 text-sm font-semibold text-slate-950">结果总览</h2>
    </div>
    <SummaryMetric label="总减速比" symbol="i total" value={formatNumber(result.totalRatio)} />
    <SummaryMetric label="输出转速" symbol="n out" value={formatNumber(result.outputRpm, 1)} unit="rpm" />
    <SummaryMetric label="输出扭矩" symbol="T out" value={formatNumber(result.outputTorque, 2)} unit="N·m" />
    <SummaryMetric label="总效率" symbol="η total" value={formatNumber(result.totalEfficiency * 100, 1)} unit="%" />
  </section>
);
