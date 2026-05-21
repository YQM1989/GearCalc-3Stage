import type { RiskWarning } from "../types/gear";

interface RiskWarningsProps {
  risks: RiskWarning[];
}

export const RiskWarnings = ({ risks }: RiskWarningsProps) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2">
      <h2 className="text-sm font-semibold text-slate-950">风险提示</h2>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
        {risks.length} 项
      </span>
    </div>

    {risks.length === 0 ? (
      <div className="px-3 py-3 text-xs text-slate-500">当前输入未触发预设风险规则。</div>
    ) : (
      <ul className="divide-y divide-slate-100">
        {risks.map((risk) => (
          <li key={risk.id} className="px-3 py-2">
            <div className="text-sm font-semibold text-amber-800">{risk.message}</div>
            {risk.detail ? <div className="mt-1 text-xs text-slate-500">{risk.detail}</div> : null}
          </li>
        ))}
      </ul>
    )}
  </section>
);
