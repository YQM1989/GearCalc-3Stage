import type { GearCalculationResult, StageInput } from "../types/gear";

interface GearTrainPreviewProps {
  stages: StageInput[];
  result: GearCalculationResult;
}

interface GearShapeProps {
  cx: number;
  cy: number;
  radius: number;
  teeth: number;
  clockwise: boolean;
  rpm: number;
  fill: string;
  stroke: string;
  label: string;
  labelOffset?: number;
}

const formatNumber = (value: number, digits = 1) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.0";

const getGearPath = (cx: number, cy: number, radius: number, teeth: number) => {
  const visualTeeth = Math.max(10, Math.min(36, Math.round(teeth)));
  const points = visualTeeth * 2;
  const rootRadius = radius * 0.88;

  return (
    Array.from({ length: points + 1 }, (_, index) => {
      const angle = -Math.PI / 2 + (index / points) * Math.PI * 2;
      const pointRadius = index % 2 === 0 ? radius : rootRadius;
      const x = cx + Math.cos(angle) * pointRadius;
      const y = cy + Math.sin(angle) * pointRadius;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ") + " Z"
  );
};

const getSpinDuration = (rpm: number) => {
  const speed = Math.max(8, Math.min(Math.abs(rpm), 3000));
  return Math.max(0.7, Math.min(8, 240 / speed));
};

const GearShape = ({
  cx,
  cy,
  radius,
  teeth,
  clockwise,
  rpm,
  fill,
  stroke,
  label,
  labelOffset = 0,
}: GearShapeProps) => {
  const duration = getSpinDuration(rpm);
  const endAngle = clockwise ? 360 : -360;

  return (
    <g>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cy}`}
          to={`${endAngle} ${cx} ${cy}`}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
        <path d={getGearPath(cx, cy, radius, teeth)} fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx={cx} cy={cy} r={radius * 0.62} fill="#f8fafc" stroke={stroke} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={radius * 0.18} fill={stroke} opacity="0.9" />
        <line
          x1={cx}
          y1={cy - radius * 0.52}
          x2={cx}
          y2={cy - radius * 0.22}
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </g>
      <text
        x={cx}
        y={cy + radius + 18 + labelOffset}
        textAnchor="middle"
        className="fill-slate-700 text-[11px] font-semibold"
      >
        {label}
      </text>
      <text x={cx} y={cy + radius + 34 + labelOffset} textAnchor="middle" className="fill-slate-500 text-[10px]">
        {formatNumber(rpm, 1)} rpm
      </text>
    </g>
  );
};

export const GearTrainPreview = ({ stages, result }: GearTrainPreviewProps) => {
  const activeStages = stages.slice(0, result.stages.length);
  const width = 1120;
  const height = 270;
  const stageWidth = 860 / Math.max(activeStages.length, 1);
  const maxPitchDiameter = Math.max(
    1,
    ...activeStages.flatMap((stage) => [stage.module * stage.driverTeeth, stage.module * stage.drivenTeeth]),
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-end justify-between gap-3 border-b border-slate-200 px-3 py-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">传动视觉预览</h2>
          <p className="mt-0.5 text-xs text-slate-500">按节圆直径近似缩放，动画速度反映各级转速。</p>
        </div>
        <div className="shrink-0 text-xs font-semibold text-slate-600">
          输出方向：<span className="text-teal-700">{result.outputDirection}</span>
        </div>
      </div>

      <div className="overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="齿轮传动视觉预览"
          preserveAspectRatio="xMidYMid meet"
          className="block aspect-[1120/270] h-[248px] w-full bg-slate-50"
        >
          <defs>
            <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#0f766e" />
            </marker>
          </defs>

          <rect x="24" y="48" width="86" height="72" rx="8" fill="#dbeafe" stroke="#2563eb" />
          <rect x="40" y="62" width="54" height="44" rx="5" fill="#eff6ff" stroke="#2563eb" />
          <text x="67" y="140" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">
            电机
          </text>
          <line x1="110" y1="84" x2="140" y2="84" stroke="#475569" strokeLinecap="round" strokeWidth="8" />

          {activeStages.map((stage, index) => {
            const stageResult = result.stages[index];
            const baseX = 158 + index * stageWidth;
            const driverDiameter = stage.module * stage.driverTeeth;
            const drivenDiameter = stage.module * stage.drivenTeeth;
            const driverRadius = 17 + (driverDiameter / maxPitchDiameter) * 30;
            const drivenRadius = 17 + (drivenDiameter / maxPitchDiameter) * 30;
            const driverCx = baseX + 42;
            const driverCy = 98;
            const drivenCx = driverCx + driverRadius + drivenRadius + 8;
            const drivenCy = driverCy;
            const driverClockwise = index % 2 === 0;
            const drivenClockwise = !driverClockwise;
            const nextStartX = 158 + (index + 1) * stageWidth + 42;

            return (
              <g key={index}>
                <text x={baseX + 8} y="36" className="fill-slate-500 text-[12px] font-semibold">
                  第 {index + 1} 级 i={formatNumber(stageResult.ratio, 2)}
                </text>
                <line
                  x1={driverCx - driverRadius - 26}
                  y1={driverCy}
                  x2={drivenCx + drivenRadius + 26}
                  y2={driverCy}
                  stroke="#94a3b8"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <GearShape
                  cx={driverCx}
                  cy={driverCy}
                  radius={driverRadius}
                  teeth={stage.driverTeeth}
                  clockwise={driverClockwise}
                  rpm={stageResult.inputRpm}
                  fill="#ccfbf1"
                  stroke="#0f766e"
                  label={`${stage.driverTeeth}齿 / m${stage.module}`}
                />
                <GearShape
                  cx={drivenCx}
                  cy={drivenCy}
                  radius={drivenRadius}
                  teeth={stage.drivenTeeth}
                  clockwise={drivenClockwise}
                  rpm={stageResult.outputRpm}
                  fill="#fde68a"
                  stroke="#b45309"
                  label={`${stage.drivenTeeth}齿 / m${stage.module}`}
                  labelOffset={18}
                />
                <path
                  d={
                    drivenClockwise
                      ? `M ${drivenCx - 18} ${driverCy - drivenRadius - 20} A 22 22 0 0 1 ${drivenCx + 18} ${
                          driverCy - drivenRadius - 20
                        }`
                      : `M ${drivenCx + 18} ${driverCy - drivenRadius - 20} A 22 22 0 0 0 ${drivenCx - 18} ${
                          driverCy - drivenRadius - 20
                        }`
                  }
                  fill="none"
                  markerEnd="url(#arrow-head)"
                  stroke="#0f766e"
                  strokeWidth="2"
                />
                {index < activeStages.length - 1 ? (
                  <line
                    x1={drivenCx + drivenRadius + 30}
                    y1={driverCy}
                    x2={nextStartX - driverRadius - 26}
                    y2={driverCy}
                    stroke="#64748b"
                    strokeDasharray="6 6"
                    strokeWidth="3"
                  />
                ) : null}
              </g>
            );
          })}

          <g transform="translate(32 222)">
            <rect x="0" y="0" width="1056" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="22" cy="17" r="7" fill="#ccfbf1" stroke="#0f766e" />
            <text x="38" y="21" className="fill-slate-600 text-[12px]">
              主动齿轮
            </text>
            <circle cx="128" cy="17" r="7" fill="#fde68a" stroke="#b45309" />
            <text x="144" y="21" className="fill-slate-600 text-[12px]">
              从动齿轮
            </text>
            <text x="268" y="21" className="fill-slate-500 text-[12px]">
              图形为工程示意，不替代强度、齿宽、轴承和箱体校核。
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
};
