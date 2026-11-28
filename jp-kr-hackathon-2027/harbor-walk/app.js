const copy = {
  ja: {
    context: "架空の港で自由行動", title: n => `集合まで${n}分。どこに寄れる？`,
    meeting: "集合まで", buffer: "何分前に戻りたい？", choose: "片道と滞在時間を見て、行き先を選ぼう",
    min: n => n + "分", walk: "片道", stay: "滞在", out: "往路", back: "復路", total: "往復＋滞在",
    early: n => `希望の帰着時刻まで${n}分余る`, exact: "希望の帰着時刻ちょうど",
    missed: n => `希望の帰着時刻より${n}分遅い`, late: n => `集合時刻に${n}分遅れる`,
    left: n => `港に戻ってから集合まで${n}分。`, onTime: "港に戻るのは集合時刻ちょうど。",
    over: n => `集合までに戻るには、所要時間を${n}分短くする必要があります。`,
    ready: "オフラインで利用できます", unavailable: "この開き方ではオフライン保存を利用できません",
  },
  ko: {
    context: "가상의 항구에서 자유 시간", title: n => `집합까지 ${n}분. 어디에 들를까요?`,
    meeting: "집합까지 남은 시간", buffer: "몇 분 전에 돌아올까요?", choose: "편도 시간과 체류 시간을 보고 목적지를 고르세요",
    min: n => n + "분", walk: "편도", stay: "체류", out: "가는 길", back: "오는 길", total: "왕복＋체류",
    early: n => `목표 귀환 시각보다 ${n}분 일찍 도착해요`, exact: "목표 귀환 시각에 딱 맞아요",
    missed: n => `목표 귀환 시각보다 ${n}분 늦어요`, late: n => `집합 시각에 ${n}분 늦어요`,
    left: n => `항구에 돌아오면 집합까지 ${n}분 남아요.`, onTime: "항구에 돌아오면 정확히 집합 시각이에요.",
    over: n => `집합 시각을 맞추려면 소요 시간을 ${n}분 줄여야 해요.`,
    ready: "오프라인으로 이용할 수 있어요", unavailable: "이 환경에서는 오프라인 저장을 사용할 수 없어요",
  },
  en: {
    context: "Free time at a fictional port", title: n => `${n} minutes to meet. Where can we go?`,
    meeting: "Time until meetup", buffer: "How early should we return?", choose: "Compare the walk and the visit, then pick a stop",
    min: n => n + " min", walk: "One way", stay: "Visit", out: "Walk out", back: "Walk back", total: "Round trip + visit",
    early: n => `${n} min ahead of your return target`, exact: "Exactly on your return target",
    missed: n => `${n} min later than your return target`, late: n => `${n} min late for the meetup`,
    left: n => `Back at the port with ${n} min until the meetup.`, onTime: "Back at the port exactly at the meetup time.",
    over: n => `Shorten the trip by ${n} min to make the meetup.`,
    ready: "Available offline", unavailable: "Offline saving is unavailable here",
  },
};

const byId = id => document.getElementById(id);
const language = byId("language");
const meeting = byId("meeting");
const buffer = byId("buffer");
let chosen;
let offlineMessage = "";

function addOptions(select, values, initial) {
  for (const minutes of values) select.add(new Option(minutes, minutes));
  select.value = initial;
}
addOptions(meeting, [30, 45, 60], 45);
addOptions(buffer, [0, 5, 10], 5);

const buttons = places.map(place => {
  const button = document.createElement("button");
  button.type = "button";
  button.innerHTML = "<b></b><span></span>";
  button.onclick = () => { chosen = place; render(); };
  byId("places").append(button);
  return button;
});

function render() {
  const lang = language.value;
  const t = copy[lang];
  document.documentElement.lang = lang;
  document.title = byId("title").textContent = t.title(meeting.value);
  for (const el of document.querySelectorAll("[data-text]")) el.textContent = t[el.dataset.text];
  for (const option of [...meeting.options, ...buffer.options]) option.textContent = t.min(option.value);
  buttons.forEach((button, i) => {
    const place = places[i];
    button.firstChild.textContent = place.name[lang];
    button.lastChild.textContent = `${t.walk} ${t.min(place.walk)} · ${t.stay} ${t.min(place.stay)}`;
    button.setAttribute("aria-pressed", String(place === chosen));
  });
  byId("offline").textContent = offlineMessage ? t[offlineMessage] : "";
  if (!chosen) return;

  const { total, untilMeeting, untilTarget } = tripTimes(chosen, Number(meeting.value), Number(buffer.value));
  byId("result").hidden = false;
  byId("result-title").textContent = chosen.name[lang];
  let verdict = t.exact;
  if (untilMeeting < 0) verdict = t.late(-untilMeeting);
  else if (untilTarget < 0) verdict = t.missed(-untilTarget);
  else if (untilTarget > 0) verdict = t.early(untilTarget);
  byId("verdict").textContent = verdict;
  byId("result").classList.toggle("tight", untilTarget < 0);
  let deadline = t.onTime;
  if (untilMeeting > 0) deadline = t.left(untilMeeting);
  if (untilMeeting < 0) deadline = t.over(-untilMeeting);
  byId("deadline").textContent = deadline;

  const durations = [chosen.walk, chosen.stay, chosen.walk];
  document.querySelectorAll(".timeline i").forEach((bar, i) => { bar.style.flexGrow = durations[i]; });
  byId("legs").textContent = [t.out, t.stay, t.back].map((leg, i) => leg + " " + t.min(durations[i])).join("  /  ");
  byId("total").textContent = t.total + " · " + t.min(total);
}

for (const select of [language, meeting, buffer]) select.onchange = render;
render();

function offlineStatus(key) {
  offlineMessage = key;
  byId("offline").textContent = copy[language.value][key];
}
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const sw = navigator.serviceWorker;
  function checkController() {
    if (sw.controller?.scriptURL === new URL("./sw.js", location.href).href) offlineStatus("ready");
  }
  sw.addEventListener("controllerchange", checkController);
  sw.register("./sw.js").then(() => sw.ready).then(checkController).catch(() => offlineStatus("unavailable"));
} else {
  offlineStatus("unavailable");
}
