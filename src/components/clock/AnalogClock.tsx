"use client";

import { polarToCartesian, hourAngle, minuteAngle } from "@/lib/clockUtils";
import type { ClockDisplayConfig } from "@/types";

// 5分ブロックのカラーセクション（交互に2色）
const SECTION_COLORS = ["#FDE68A", "#BFDBFE"]; // 黄・青

const CX = 160;
const CY = 160;
const R_OUTER = 155;   // 外周フレーム
const R_MIN_NUM = 138; // 分数字の配置半径
const R_COLOR_OUTER = 152;
const R_COLOR_INNER = 118;
const R_TICK_OUTER = 115;
const R_TICK_INNER_LONG = 108;  // 5分目盛り
const R_TICK_INNER_SHORT = 112; // 1分目盛り
const R_HOUR_NUM = 96;  // 時の数字

interface AnalogClockProps {
  hour: number;
  minute: number;
  config: ClockDisplayConfig;
  size?: number;
}

export default function AnalogClock({
  hour,
  minute,
  config,
  size = 320,
}: AnalogClockProps) {
  const scale = size / 320;
  const hAngle = hourAngle(hour, minute);
  const mAngle = minuteAngle(minute);

  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      style={{ display: "block" }}
      aria-label={`${hour}じ${minute === 0 ? "ちょうど" : `${minute}ふん`}の とけい`}
    >
      {/* 外周の白背景 */}
      <circle cx={CX} cy={CY} r={R_OUTER} fill="white" stroke="#e2e8f0" strokeWidth="3" />

      {/* カラーセクション（5分ブロック）*/}
      {config.showColorSections &&
        Array.from({ length: 12 }, (_, i) => {
          const startDeg = i * 30 - 90;
          const endDeg = startDeg + 30;
          const color = SECTION_COLORS[i % 2];
          const p1 = polarToCartesian(CX, CY, R_COLOR_OUTER, startDeg + 90);
          const p2 = polarToCartesian(CX, CY, R_COLOR_OUTER, endDeg + 90);
          const p3 = polarToCartesian(CX, CY, R_COLOR_INNER, endDeg + 90);
          const p4 = polarToCartesian(CX, CY, R_COLOR_INNER, startDeg + 90);
          return (
            <path
              key={i}
              d={`M ${p1.x} ${p1.y} A ${R_COLOR_OUTER} ${R_COLOR_OUTER} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${R_COLOR_INNER} ${R_COLOR_INNER} 0 0 0 ${p4.x} ${p4.y} Z`}
              fill={color}
              opacity="0.85"
            />
          );
        })}

      {/* 目盛り */}
      {Array.from({ length: 60 }, (_, i) => {
        const angle = i * 6;
        const isFive = i % 5 === 0;
        const outer = R_TICK_OUTER;
        const inner = isFive ? R_TICK_INNER_LONG : R_TICK_INNER_SHORT;
        const p1 = polarToCartesian(CX, CY, outer, angle);
        const p2 = polarToCartesian(CX, CY, inner, angle);
        return (
          <line
            key={i}
            x1={p1.x} y1={p1.y}
            x2={p2.x} y2={p2.y}
            stroke={isFive ? "#475569" : "#94a3b8"}
            strokeWidth={isFive ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        );
      })}

      {/* 全分数字（0〜59）*/}
      {config.showAllMinuteNumbers &&
        Array.from({ length: 60 }, (_, i) => {
          const angle = i * 6;
          const pos = polarToCartesian(CX, CY, R_MIN_NUM, angle);
          // 5の倍数は少し大きく
          const isFive = i % 5 === 0;
          if (!isFive && !config.showAllMinuteNumbers) return null;
          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isFive ? 10 : 7}
              fontWeight={isFive ? "700" : "400"}
              fill={isFive ? "#1d4ed8" : "#3b82f6"}
              fontFamily="var(--font-noto), sans-serif"
            >
              {i}
            </text>
          );
        })}

      {/* 5分刻みの分数字のみ */}
      {!config.showAllMinuteNumbers &&
        config.showFiveMinuteNumbers &&
        Array.from({ length: 12 }, (_, i) => {
          const minuteVal = i * 5;
          const angle = minuteVal * 6;
          const pos = polarToCartesian(CX, CY, R_MIN_NUM, angle);
          return (
            <text
              key={i}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight="700"
              fill="#1d4ed8"
              fontFamily="var(--font-noto), sans-serif"
            >
              {minuteVal}
            </text>
          );
        })}

      {/* 時の数字（1〜12）*/}
      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const angle = h * 30;
        const pos = polarToCartesian(CX, CY, R_HOUR_NUM, angle);
        return (
          <text
            key={h}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={config.showAllMinuteNumbers || config.showFiveMinuteNumbers ? 18 : 22}
            fontWeight="900"
            fill="#dc2626"
            fontFamily="var(--font-noto), sans-serif"
          >
            {h}
          </text>
        );
      })}

      {/* 文字盤中央の白円（針の根元用）*/}
      <circle cx={CX} cy={CY} r={28} fill="white" />

      {/* 時針（赤） */}
      <ClockHand
        cx={CX} cy={CY}
        angle={hAngle}
        length={52}
        width={8}
        color="#dc2626"
      />

      {/* 分針 */}
      <ClockHand
        cx={CX} cy={CY}
        angle={mAngle}
        length={72}
        width={5}
        color="#16a34a"
      />

      {/* 中心ピン */}
      <circle cx={CX} cy={CY} r={7} fill="#1e293b" />
      <circle cx={CX} cy={CY} r={3} fill="white" />
    </svg>
  );
}

function ClockHand({
  cx, cy, angle, length, width, color,
}: {
  cx: number; cy: number;
  angle: number; length: number; width: number; color: string;
}) {
  const tip = polarToCartesian(cx, cy, length, angle);
  const tail = polarToCartesian(cx, cy, -14, angle);
  return (
    <line
      x1={tail.x} y1={tail.y}
      x2={tip.x} y2={tip.y}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      style={{ transition: "all 0.4s ease" }}
    />
  );
}
