import type { StageCalculation } from "../types/gear";

interface StageResultTableProps {
  stages: StageCalculation[];
}

const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

export const StageResultTable = ({ stages }: StageResultTableProps) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <h2 className="text-base font-semibold text-slate-950">每级计算明细</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">级数</th>
            <th className="px-5 py-3 font-semibold">减速比</th>
            <th className="px-5 py-3 font-semibold">输入转速 rpm</th>
            <th className="px-5 py-3 font-semibold">输出转速 rpm</th>
            <th className="px-5 py-3 font-semibold">输入扭矩 N·m</th>
            <th className="px-5 py-3 font-semibold">输出扭矩 N·m</th>
            <th className="px-5 py-3 font-semibold">效率</th>
            <th className="px-5 py-3 font-semibold">中心距 mm</th>
            <th className="px-5 py-3 font-semibold">备注</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stages.map((stage) => (
            <tr key={stage.stageIndex} className="text-slate-700">
              <td className="px-5 py-3 font-semibold text-slate-950">第 {stage.stageIndex} 级</td>
              <td className="px-5 py-3">{formatNumber(stage.ratio)}</td>
              <td className="px-5 py-3">{formatNumber(stage.inputRpm, 1)}</td>
              <td className="px-5 py-3">{formatNumber(stage.outputRpm, 1)}</td>
              <td className="px-5 py-3">{formatNumber(stage.inputTorque, 3)}</td>
              <td className="px-5 py-3">{formatNumber(stage.outputTorque, 3)}</td>
              <td className="px-5 py-3">{formatNumber(stage.efficiency, 1)}%</td>
              <td className="px-5 py-3">{formatNumber(stage.centerDistance, 2)}</td>
              <td className="px-5 py-3 text-slate-500">{stage.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
