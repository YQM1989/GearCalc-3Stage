import type { RiskWarning } from "../types/gear";

interface RiskWarningsProps {
  risks: RiskWarning[];
}

export const RiskWarnings = ({ risks }: RiskWarningsProps) => (
  <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
      <h2 className="text-base font-semibold text-slate-950">风险提示</h2>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        {risks.length} 项
      </span>
    </div>

    {risks.length === 0 ? (
      <div className="px-5 py-5 text-sm text-slate-500">当前输入未触发预设风险规则。</div>
    ) : (
      <ul className="divide-y divide-slate-100">
        {risks.map((risk) => (
          <li key={risk.id} className="px-5 py-4">
            <div className="font-semibold text-amber-800">{risk.message}</div>
            {risk.detail ? <div className="mt-1 text-sm text-slate-500">{risk.detail}</div> : null}
          </li>
        ))}
      </ul>
    )}
  </section>
);
