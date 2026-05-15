// Streak（連續學習天數）計算。
// 「活動」定義為 attempts 表有紀錄的日期 — 完成 quiz 才算數，避免單純打開 app 灌水。
// 寬限 1 天：今天還沒做 quiz 不算斷，要過 24 小時都沒紀錄才斷。

function pad(n) {
  return String(n).padStart(2, "0");
}

export function toLocalDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysBetweenStr(a, b) {
  const dA = new Date(`${a}T00:00:00`).getTime();
  const dB = new Date(`${b}T00:00:00`).getTime();
  return Math.round((dB - dA) / 86400000);
}

export function computeStreak(dateStrings) {
  if (!dateStrings || dateStrings.length === 0) {
    return { current: 0, max: 0 };
  }

  const unique = [...new Set(dateStrings)].sort();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const todayStr = toLocalDateStr(today);
  const yesterdayStr = toLocalDateStr(yesterday);

  // current：從今天（或昨天作為寬限）往回走
  let anchor = null;
  if (unique.includes(todayStr)) anchor = todayStr;
  else if (unique.includes(yesterdayStr)) anchor = yesterdayStr;

  let current = 0;
  if (anchor) {
    let cursor = anchor;
    const set = new Set(unique);
    while (set.has(cursor)) {
      current++;
      const d = new Date(`${cursor}T00:00:00`);
      d.setDate(d.getDate() - 1);
      cursor = toLocalDateStr(d);
    }
  }

  // max：sorted dates 走一遍、連續就 +1，不連續就重置
  let max = 0;
  let run = 0;
  for (let i = 0; i < unique.length; i++) {
    if (i === 0 || daysBetweenStr(unique[i - 1], unique[i]) !== 1) {
      run = 1;
    } else {
      run++;
    }
    if (run > max) max = run;
  }

  return { current, max };
}
