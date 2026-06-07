/**
 * 時針の角度を計算（0度 = 12時位置、時計回り）
 * 時針は分によって少し動く（1時間で30度、1分で0.5度）
 */
export function hourAngle(hour: number, minute: number): number {
  return (hour % 12) * 30 + minute * 0.5;
}

/** 分針の角度を計算（0度 = 12時位置、時計回り） */
export function minuteAngle(minute: number): number {
  return minute * 6;
}

/** 角度からSVGの座標を計算（cx,cy = 中心、r = 半径） */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** 時刻を日本語テキストに変換 */
export function timeToJapanese(hour: number, minute: number): string {
  if (minute === 0) return `${hour}じ ちょうど`;
  if (minute === 30) return `${hour}じ はん`;
  return `${hour}じ ${minute}ふん`;
}

/** 時刻を短い日本語テキストに変換（選択肢用） */
export function timeToShortJapanese(hour: number, minute: number): string {
  if (minute === 0) return `${hour}じ ちょうど`;
  if (minute === 30) return `${hour}じ はん`;
  return `${hour}じ ${minute}ふん`;
}
