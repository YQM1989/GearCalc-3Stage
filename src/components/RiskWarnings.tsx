import type { RiskWarning } from "../types/gear";

interface RiskWarningsProps {
  risks: RiskWarning[];
}

const splitRisk = (risk: RiskWarning) => {
  const [title, ...rest] = risk.message.split("：");
  return {
    title,
    body: rest.join("：") || risk.detail || risk.message,
    detail: rest.length > 0 ? risk.detail : undefined,
  };
};

export const RiskWarnings = ({ risks }: RiskWarningsProps) => (
  <section className="px-4 pb-4">
    <div className="flex h-12 items-center justify-between border-b border-slate-200">
      <h2 className="border-l-[3px] border-blue-600 pl-2 text-sm font-semibold text-slate-950">状态与风险</h2>
      <span className={`text-xs font-semibold ${risks.length > 0 ? "text-red-600" : "text-emerald-700"}`}>
        {risks.length > 0 ? `共 ${risks.length} 项风险` : "状态正常"}
      </span>
    </div>

    {risks.length === 0 ? (
      <div className="border-b border-slate-200 py-4 text-xs leading-5 text-slate-500">当前输入未触发预设风险规则。</div>
    ) : (
      <ul className="divide-y divide-slate-200">
        {risks.map((risk) => {
          const content = splitRisk(risk);
          const error = risk.severity === "error";

          return (
            <li key={risk.id} className={`border-l-2 py-2.5 pl-3 ${error ? "border-red-600" : "border-amber-500"}`}>
              <div className="text-sm font-semibold text-slate-900">{content.title}</div>
              <div className="mt-0.5 text-[11px] leading-4 text-slate-600">{content.body}</div>
              {content.detail ? <div className="mt-0.5 text-[11px] leading-4 text-slate-500">{content.detail}</div> : null}
            </li>
          );
        })}
      </ul>
    )}
  </section>
);
