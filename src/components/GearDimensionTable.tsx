import type { GearGeometry } from "../types/gear";

interface GearDimensionTableProps {
  gears: GearGeometry[];
}

const formatNumber = (value: number, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

export const GearDimensionTable = ({ gears }: GearDimensionTableProps) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <h2 className="text-base font-semibold text-slate-950">齿轮尺寸表</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">级数</th>
            <th className="px-5 py-3 font-semibold">齿轮</th>
            <th className="px-5 py-3 font-semibold">模数 mm</th>
            <th className="px-5 py-3 font-semibold">齿数</th>
            <th className="px-5 py-3 font-semibold">节圆直径 mm</th>
            <th className="px-5 py-3 font-semibold">齿顶圆直径 mm</th>
            <th className="px-5 py-3 font-semibold">齿根圆直径 mm</th>
            <th className="px-5 py-3 font-semibold">齿距 mm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {gears.map((gear) => (
            <tr key={`${gear.stageIndex}-${gear.role}`} className="text-slate-700">
              <td className="px-5 py-3 font-semibold text-slate-950">第 {gear.stageIndex} 级</td>
              <td className="px-5 py-3">{gear.role}</td>
              <td className="px-5 py-3">{formatNumber(gear.module, 2)}</td>
              <td className="px-5 py-3">{formatNumber(gear.teeth, 0)}</td>
              <td className="px-5 py-3">{formatNumber(gear.pitchDiameter, 2)}</td>
              <td className="px-5 py-3">{formatNumber(gear.addendumDiameter, 2)}</td>
              <td className="px-5 py-3">{formatNumber(gear.rootDiameter, 2)}</td>
              <td className="px-5 py-3">{formatNumber(gear.circularPitch, 3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
