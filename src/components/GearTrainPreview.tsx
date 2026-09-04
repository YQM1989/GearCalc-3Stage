import { useMemo, useState } from "react";
import type { GearCalculationResult, StageInput } from "../types/gear";

interface GearTrainPreviewProps {
  stages: StageInput[];
  result: GearCalculationResult;
}

interface GearProfileProps {
  cx: number;
  cy: number;
  pitchRadius: number;
  teeth: number;
  toothPitch: number;
  phase: number;
  fill: string;
  stroke: string;
}

const DRIVER_FILL = "#a8d4cd";
const DRIVER_STROKE = "#176b61";
const DRIVEN_FILL = "#efd39a";
const DRIVEN_STROKE = "#9a6515";
const CONTACT = "#cf2e2e";

const formatNumber = (value: number, digits = 1) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.0";

const polarPoint = (cx: number, cy: number, radius: number, angle: number) => ({
  x: cx + Math.cos(angle) * radius,
  y: cy + Math.sin(angle) * radius,
});

const getGearPath = (
  cx: number,
  cy: number,
  pitchRadius: number,
  teeth: number,
  toothPitch: number,
  phase: number,
) => {
  const safeTeeth = Math.max(4, Math.min(240, Math.round(teeth)));
  const angularPitch = (Math.PI * 2) / safeTeeth;
  const addendum = Math.max(1.8, toothPitch / Math.PI);
  const dedendum = Math.max(2.3, addendum * 1.25);
  const outerRadius = Math.max(4, pitchRadius + addendum);
  const rootRadius = Math.max(3, pitchRadius - dedendum);
  const points: Array<{ x: number; y: number }> = [];

  for (let index = 0; index < safeTeeth; index += 1) {
    const centerAngle = phase + index * angularPitch;
    [
      [-0.5, rootRadius],
      [-0.29, rootRadius],
      [-0.19, outerRadius],
      [0.19, outerRadius],
      [0.29, rootRadius],
      [0.5, rootRadius],
    ].forEach(([pitchOffset, radius]) => {
      points.push(polarPoint(cx, cy, radius, centerAngle + pitchOffset * angularPitch));
    });
  }

  return `${points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ")} Z`;
};

const GearProfile = ({
  cx,
  cy,
  pitchRadius,
  teeth,
  toothPitch,
  phase,
  fill,
  stroke,
}: GearProfileProps) => {
  const boreRadius = Math.max(3.5, Math.min(12, pitchRadius * 0.28));

  return (
    <g>
      <path
        d={getGearPath(cx, cy, pitchRadius, teeth, toothPitch, phase)}
        fill={fill}
        stroke={stroke}
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <circle
        cx={cx}
        cy={cy}
        r={pitchRadius}
        fill="none"
        stroke={stroke}
        strokeDasharray="3 3"
        strokeOpacity="0.58"
        strokeWidth="0.8"
      />
      <circle cx={cx} cy={cy} r={boreRadius} fill="#f8fafc" stroke={stroke} strokeWidth="1" />
      <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} stroke="#334155" strokeWidth="0.8" />
      <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} stroke="#334155" strokeWidth="0.8" />
      {boreRadius >= 7 ? (
        <rect
          x={cx - 1.8}
          y={cy - boreRadius}
          width="3.6"
          height={Math.max(4, boreRadius * 0.46)}
          fill="#f8fafc"
          stroke={stroke}
          strokeWidth="0.7"
        />
      ) : null}
    </g>
  );
};

const MotorSymbol = () => (
  <g transform="translate(18 181)">
    <path d="M 0 12 H 9 V 58 H 0" fill="#d7e8e6" stroke="#334155" />
    <rect x="9" y="5" width="68" height="60" rx="8" fill="#a8d4cd" stroke="#334155" strokeWidth="1.4" />
    <path d="M 18 14 H 67 M 18 23 H 67 M 18 32 H 67 M 18 41 H 67 M 18 50 H 67" stroke="#527a77" />
    <rect x="29" y="0" width="26" height="6" rx="1" fill="#d7e8e6" stroke="#334155" />
    <rect x="77" y="20" width="13" height="30" fill="#d9dee1" stroke="#334155" />
    <rect x="90" y="30" width="34" height="10" rx="2" fill="#64748b" />
    <path d="M 10 70 H 76 M 18 65 V 70 M 68 65 V 70" stroke="#334155" strokeWidth="1.4" />
    <text x="43" y="89" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">
      电机
    </text>
  </g>
);

const MeshDetail = ({ stage, stageIndex }: { stage: StageInput; stageIndex: number }) => {
  const pitch = Math.PI * stage.module;

  return (
    <g transform="translate(292 418)">
      <rect width="330" height="142" rx="4" fill="#fbfcfc" stroke="#b9c4ca" />
      <text x="165" y="20" textAnchor="middle" className="fill-slate-800 text-[12px] font-semibold">
        啮合局部放大（第 {stageIndex + 1} 级）
      </text>
      <path
        d="M 44 118 L 44 83 C 62 83 65 55 80 48 C 96 42 102 77 117 78 C 132 79 138 50 153 50 L 153 118 Z"
        fill={DRIVER_FILL}
        stroke={DRIVER_STROKE}
        strokeWidth="1.2"
      />
      <path
        d="M 177 118 L 177 54 C 193 54 199 83 214 82 C 229 81 235 47 251 50 C 266 53 270 82 286 83 L 286 118 Z"
        fill={DRIVEN_FILL}
        stroke={DRIVEN_STROKE}
        strokeWidth="1.2"
      />
      <line x1="30" y1="84" x2="302" y2="84" stroke="#64748b" strokeDasharray="5 4" strokeWidth="0.8" />
      <line x1="30" y1="100" x2="302" y2="100" stroke="#334155" strokeDasharray="9 3 2 3" strokeWidth="0.8" />
      <line x1="77" y1="124" x2="255" y2="59" stroke={CONTACT} strokeWidth="1.4" />
      <circle cx="166" cy="91.5" r="5" fill="#ffffff" stroke={CONTACT} strokeWidth="2" />
      <circle cx="166" cy="91.5" r="1.7" fill={CONTACT} />
      <text x="174" y="87" className="fill-red-700 text-[10px] font-semibold">P</text>
      <text x="226" y="54" className="fill-red-700 text-[10px] font-semibold">作用线 α=20°</text>
      <text x="8" y="87" className="fill-slate-500 text-[9px]">节圆</text>
      <text x="8" y="103" className="fill-slate-500 text-[9px]">轴心线</text>
      <path d="M 65 126 V 134 M 65 130 H 137 M 137 126 V 134" stroke="#334155" strokeWidth="0.8" />
      <path d="M 194 126 V 134 M 194 130 H 266 M 266 126 V 134" stroke="#334155" strokeWidth="0.8" />
      <text x="101" y="140" textAnchor="middle" className="fill-slate-700 text-[9px]">
        p = πm = {formatNumber(pitch, 3)} mm
      </text>
      <text x="230" y="140" textAnchor="middle" className="fill-slate-700 text-[9px]">
        p = πm = {formatNumber(pitch, 3)} mm
      </text>
    </g>
  );
};

export const GearTrainPreview = ({ stages, result }: GearTrainPreviewProps) => {
  const activeStages = stages.slice(0, result.stages.length);
  const [selectedStage, setSelectedStage] = useState(0);
  const safeSelectedStage = Math.min(selectedStage, Math.max(0, activeStages.length - 1));
  const stageCenters = useMemo(() => {
    if (activeStages.length === 1) return [440];
    if (activeStages.length === 2) return [315, 620];
    return [245, 485, 725];
  }, [activeStages.length]);

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <h2 className="border-l-[3px] border-blue-600 pl-2 text-sm font-semibold text-slate-950">传动链示意图</h2>
        <div className="text-xs text-slate-500">
          输出方向：<span className="font-semibold text-blue-700">{result.outputDirection}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-2">
        <svg
          viewBox="0 0 900 575"
          role="img"
          aria-label="按模数、齿数和节圆关系绘制的三级直齿轮传动示意图"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
          <defs>
            <marker id="rotation-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
              <path d="M 0 0 L 7 3.5 L 0 7 z" fill="#12806d" />
            </marker>
            <marker id="dimension-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
              <path d="M 0 3 L 6 0 L 6 6 z" fill="#475569" />
            </marker>
          </defs>

          <text x="450" y="19" textAnchor="middle" className="fill-slate-600 text-[11px] font-semibold">
            各级独立比例显示 · 点击齿轮副查看啮合细节
          </text>
          <line x1="8" y1="216" x2="882" y2="216" stroke="#64748b" strokeDasharray="10 4 2 4" strokeWidth="0.8" />
          <MotorSymbol />

          {activeStages.map((stage, index) => {
            const stageResult = result.stages[index];
            const centerX = stageCenters[index];
            const validStage =
              Number.isFinite(stage.module) &&
              stage.module > 0 &&
              Number.isInteger(stage.driverTeeth) &&
              stage.driverTeeth > 0 &&
              Number.isInteger(stage.drivenTeeth) &&
              stage.drivenTeeth > 0;

            if (!validStage) {
              return (
                <g key={index}>
                  <rect x={centerX - 96} y="70" width="192" height="275" rx="6" fill="#fff7f7" stroke="#dc2626" />
                  <text x={centerX} y="102" textAnchor="middle" className="fill-red-700 text-[12px] font-semibold">
                    第 {index + 1} 级参数无效
                  </text>
                  <text x={centerX} y="126" textAnchor="middle" className="fill-slate-500 text-[10px]">
                    请修正模数与齿数后再绘制
                  </text>
                </g>
              );
            }

            const toothPitch = Math.min(6.2, 4.4 + stage.module * 1.4);
            const naturalDrivenRadius = (stage.drivenTeeth * toothPitch) / (Math.PI * 2);
            const radiusScale = naturalDrivenRadius > 86 ? 86 / naturalDrivenRadius : 1;
            const drivenRadius = Math.max(18, naturalDrivenRadius * radiusScale);
            const driverRadius = Math.max(7.5, (stage.driverTeeth * toothPitch * radiusScale) / (Math.PI * 2));
            const pairWidth = driverRadius + drivenRadius;
            const driverCx = centerX - pairWidth / 2;
            const drivenCx = driverCx + driverRadius + drivenRadius;
            const cy = 216;
            const contactX = driverCx + driverRadius;
            const drivenPhase = Math.PI + Math.PI / Math.max(4, Math.round(stage.drivenTeeth));
            const actionDx = 34;
            const actionDy = Math.tan((20 * Math.PI) / 180) * actionDx;
            const selected = safeSelectedStage === index;

            return (
              <g
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`查看第 ${index + 1} 级啮合细节`}
                onClick={() => setSelectedStage(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setSelectedStage(index);
                }}
                className="cursor-pointer outline-none"
              >
                <rect
                  x={centerX - 105}
                  y="35"
                  width="210"
                  height="330"
                  rx="6"
                  fill={selected ? "#f6faf9" : "transparent"}
                  stroke={selected ? "#9bbdb7" : "transparent"}
                  strokeWidth="1"
                />
                <text x={centerX} y="56" textAnchor="middle" className="fill-slate-900 text-[12px] font-semibold">
                  第 {index + 1} 级　i={formatNumber(stageResult.ratio, 2)}
                </text>
                <text x={centerX} y="76" textAnchor="middle" className="fill-slate-600 text-[10px]">
                  m={formatNumber(stage.module, 1)}　z₁={stage.driverTeeth} / z₂={stage.drivenTeeth}
                </text>
                <g>
                  <rect x={centerX - 73} y="87" width="146" height="25" rx="3" fill="#f3faf7" stroke="#15806e" />
                  <text x={centerX} y="103" textAnchor="middle" className="fill-emerald-800 text-[10px] font-semibold">
                    同模数 m={formatNumber(stage.module, 1)} · 同齿距
                  </text>
                </g>
                <path
                  d={`M ${centerX - 25} 137 A 31 31 0 0 1 ${centerX + 25} 137`}
                  fill="none"
                  stroke="#12806d"
                  strokeWidth="1.5"
                  markerEnd="url(#rotation-arrow)"
                />

                <line x1={driverCx - driverRadius - 18} y1={cy} x2={drivenCx + drivenRadius + 18} y2={cy} stroke="#64748b" strokeWidth="3" />
                <GearProfile
                  cx={driverCx}
                  cy={cy}
                  pitchRadius={driverRadius}
                  teeth={stage.driverTeeth}
                  toothPitch={toothPitch * radiusScale}
                  phase={0}
                  fill={DRIVER_FILL}
                  stroke={DRIVER_STROKE}
                />
                <GearProfile
                  cx={drivenCx}
                  cy={cy}
                  pitchRadius={drivenRadius}
                  teeth={stage.drivenTeeth}
                  toothPitch={toothPitch * radiusScale}
                  phase={drivenPhase}
                  fill={DRIVEN_FILL}
                  stroke={DRIVEN_STROKE}
                />
                <line
                  x1={contactX - actionDx}
                  y1={cy + actionDy}
                  x2={contactX + actionDx}
                  y2={cy - actionDy}
                  stroke={CONTACT}
                  strokeWidth="1.3"
                />
                <circle cx={contactX} cy={cy} r="5.5" fill="#ffffff" stroke={CONTACT} strokeWidth="1.7" />
                <circle cx={contactX} cy={cy} r="2" fill={CONTACT} />
                <text x={contactX + 7} y={cy - 7} className="fill-red-700 text-[10px] font-semibold">P</text>
                <text x={contactX + 30} y={cy - 18} className="fill-red-700 text-[9px] font-semibold">α=20°</text>

                <text x={driverCx - 2} y="308" textAnchor="end" className="fill-slate-700 text-[10px]">
                  z={stage.driverTeeth}　d={formatNumber(stage.module * stage.driverTeeth, 2)}
                </text>
                <text x={driverCx - 2} y="325" textAnchor="end" className="fill-slate-500 text-[9px]">
                  n={formatNumber(stageResult.inputRpm, 1)} rpm
                </text>
                <text x={drivenCx + 3} y="308" className="fill-slate-700 text-[10px]">
                  z={stage.drivenTeeth}　d={formatNumber(stage.module * stage.drivenTeeth, 2)}
                </text>
                <text x={drivenCx + 3} y="325" className="fill-slate-500 text-[9px]">
                  n={formatNumber(stageResult.outputRpm, 1)} rpm
                </text>

                <line x1={driverCx} y1="337" x2={driverCx} y2="365" stroke="#94a3b8" strokeWidth="0.8" />
                <line x1={drivenCx} y1="337" x2={drivenCx} y2="365" stroke="#94a3b8" strokeWidth="0.8" />
                <line
                  x1={driverCx + 3}
                  y1="355"
                  x2={drivenCx - 3}
                  y2="355"
                  stroke="#475569"
                  strokeWidth="0.8"
                  markerStart="url(#dimension-arrow)"
                  markerEnd="url(#dimension-arrow)"
                />
                <text x={contactX} y="375" textAnchor="middle" className="fill-slate-700 text-[9px]">
                  a={formatNumber(stageResult.centerDistance, 2)} mm
                </text>
              </g>
            );
          })}

          <g transform="translate(46 427)">
            <rect width="194" height="123" rx="4" fill="#fbfcfc" stroke="#b9c4ca" />
            <line x1="18" y1="27" x2="62" y2="27" stroke="#334155" strokeDasharray="9 3 2 3" />
            <text x="74" y="31" className="fill-slate-600 text-[10px]">轴心线</text>
            <line x1="18" y1="54" x2="62" y2="54" stroke="#64748b" strokeDasharray="4 4" />
            <text x="74" y="58" className="fill-slate-600 text-[10px]">节圆（d）</text>
            <line x1="18" y1="81" x2="62" y2="81" stroke={CONTACT} />
            <text x="74" y="85" className="fill-slate-600 text-[10px]">作用线 α=20°</text>
            <circle cx="40" cy="105" r="5" fill="#fff" stroke={CONTACT} strokeWidth="1.7" />
            <circle cx="40" cy="105" r="1.7" fill={CONTACT} />
            <text x="74" y="109" className="fill-slate-600 text-[10px]">啮合点 P</text>
          </g>

          {activeStages[safeSelectedStage] ? (
            <MeshDetail stage={activeStages[safeSelectedStage]} stageIndex={safeSelectedStage} />
          ) : null}

          <g transform="translate(668 427)">
            <rect width="196" height="123" fill="#fbfcfc" stroke="#64748b" />
            <path d="M 0 29 H 196 M 0 57 H 196 M 0 86 H 196 M 62 0 V 123" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="13" y="19" className="fill-slate-600 text-[9px]">图名</text>
            <text x="74" y="19" className="fill-slate-800 text-[9px] font-semibold">传动方案总成</text>
            <text x="13" y="47" className="fill-slate-600 text-[9px]">图号</text>
            <text x="74" y="47" className="fill-slate-800 text-[9px]">GRC-3ST-001</text>
            <text x="13" y="75" className="fill-slate-600 text-[9px]">状态</text>
            <text x="74" y="75" className="fill-slate-800 text-[9px]">方案校核</text>
            <text x="13" y="104" className="fill-slate-600 text-[9px]">日期</text>
            <text x="74" y="104" className="fill-slate-800 text-[9px]">2026-09-04</text>
            <text x="13" y="117" className="fill-slate-600 text-[8px]">GearCalc · 单位 mm</text>
          </g>
        </svg>
      </div>
    </section>
  );
};
