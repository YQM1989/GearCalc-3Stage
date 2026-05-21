import type { GearGeometry } from "../types/gear";

interface GearDimensionTableProps {
  gears: GearGeometry[];
}

const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

export const GearDimensionTable = ({ gears }: GearDimensionTableProps) => (
  <section className="flex h-full min-h-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-3 py-2">
      <h2 className="text-sm font-semibold text-slate-950">齿轮尺寸表</h2>
    </div>
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full min-w-[720px] text-left text-[11px]">
        <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
          <tr>
            <th className="px-2 py-2 font-semibold">级数</th>
            <th className="px-2 py-2 font-semibold">齿轮</th>
            <th className="px-2 py-2 font-semibold">模数 mm</th>
            <th className="px-2 py-2 font-semibold">齿数</th>
            <th className="px-2 py-2 font-semibold">节圆直径 mm</th>
            <th className="px-2 py-2 font-semibold">齿顶圆直径 mm</th>
            <th className="px-2 py-2 font-semibold">齿根圆直径 mm</th>
            <th className="px-2 py-2 font-semibold">齿距 mm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {gears.map((gear) => (
            <tr key={`${gear.stageIndex}-${gear.role}`} className="text-slate-700">
              <td className="px-2 py-2 font-semibold text-slate-950">第 {gear.stageIndex} 级</td>
              <td className="px-2 py-2">{gear.role}</td>
              <td className="px-2 py-2">{formatNumber(gear.module, 2)}</td>
              <td className="px-2 py-2">{formatNumber(gear.teeth, 0)}</td>
              <td className="px-2 py-2">{formatNumber(gear.pitchDiameter, 2)}</td>
              <td className="px-2 py-2">{formatNumber(gear.addendumDiameter, 2)}</td>
              <td className="px-2 py-2">{formatNumber(gear.rootDiameter, 2)}</td>
              <td className="px-2 py-2">{formatNumber(gear.circularPitch, 3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
