// 教材用の仮想データ。walk は港からの片道、stay は現地での滞在（分）。
const places = [
  { name: { ja: "海辺の広場", ko: "바닷가 광장", en: "Seaside plaza" }, walk: 8, stay: 10 },
  { name: { ja: "港の市場", ko: "항구 시장", en: "Harbor market" }, walk: 12, stay: 15 },
  { name: { ja: "展望台", ko: "전망대", en: "Lookout" }, walk: 16, stay: 12 },
];

function tripTimes(place, timeToMeet, buffer) {
  const total = place.walk * 2 + place.stay;
  const untilMeeting = timeToMeet - total;
  return { total, untilMeeting, untilTarget: untilMeeting - buffer };
}
