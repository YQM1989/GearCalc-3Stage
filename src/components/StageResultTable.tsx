import type { StageCalculation } from "../types/gear";

interface StageResultTableProps {
  stages: StageCalculation[];
}

const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

export const StageResultTable = ({ stages }: StageResultTableProps) => (
  <section className="flex h-full min-h-0 flex-col bg-white">
    <div className="flex h-10 shrink-0 items-center border-b border-slate-200 px-4">
      <h2 className="border-l-[3px] border-blue-600 pl-2 text-sm font-semibold text-slate-950">计算明细</h2>
    </div>
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full min-w-[720px] text-left text-[11px]">
        <thead className="sticky top-0 bg-slate-50 text-[10px] text-slate-500">
          <tr>
            <th className="px-2 py-2 font-semibold">级数</th>
            <th className="px-2 py-2 font-semibold">减速比</th>
            <th className="px-2 py-2 font-semibold">输入转速 rpm</th>
            <th className="px-2 py-2 font-semibold">输出转速 rpm</th>
            <th className="px-2 py-2 font-semibold">输入扭矩 N·m</th>
            <th className="px-2 py-2 font-semibold">输出扭矩 N·m</th>
            <th className="px-2 py-2 font-semibold">效率</th>
            <th className="px-2 py-2 font-semibold">中心距 mm</th>
            <th className="px-2 py-2 font-semibold">备注</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stages.map((stage) => (
            <tr key={stage.stageIndex} className="text-slate-700 hover:bg-blue-50/40">
              <td className="px-2 py-2 font-semibold text-slate-950">第 {stage.stageIndex} 级</td>
              <td className="px-2 py-2">{formatNumber(stage.ratio)}</td>
              <td className="px-2 py-2">{formatNumber(stage.inputRpm, 1)}</td>
              <td className="px-2 py-2">{formatNumber(stage.outputRpm, 1)}</td>
              <td className="px-2 py-2">{formatNumber(stage.inputTorque, 3)}</td>
              <td className="px-2 py-2">{formatNumber(stage.outputTorque, 3)}</td>
              <td className="px-2 py-2">{formatNumber(stage.efficiency, 1)}%</td>
              <td className="px-2 py-2">{formatNumber(stage.centerDistance, 2)}</td>
              <td className="px-2 py-2 text-slate-500">{stage.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
