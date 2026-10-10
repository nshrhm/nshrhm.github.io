/* 旅行しおりの主要データ。日程変更時はこのファイルの時刻・持ち物・リンクを更新すると反映しやすいです。 */
const TRIP = {
  updated: '2026-10-10',
  verified: '2026-10-10',
  dateLabel: '2026年11月7日（土）〜8日（日）',
  meeting: '15:00',
  fee: '3,000円（持込別）',
  payment: '現地で幹事に支払い',
  feeNote: '金額の単位・含まれる費用・差額精算は要確認',
  bbqPlan: '機材レンタルプラン（予約者確認済み）',
  shoppingNote: 'チェックイン後に持ち寄り量を確認し、必要な場合のみ不足分を購入',
  decision: '前日までに各車が天気・道路状況を共有し、総合代表がプランを取りまとめて家族LINEで連絡。移動中に遅延した場合は到着見込みを共有し、宿での休憩と必要時だけの買い出しを優先。早め出発は出発前だけの選択肢です。',
  checkinISO: '2026-11-07T15:00:00+09:00',
  checkoutISO: '2026-11-08T10:00:00+09:00',
  hotel: {
    name: 'AMBER Yufuin【Villa1】',
    address: '〒879-5103 大分県由布市湯布院町川南839-12',
    phone: '0977-75-9238',
    reception: '9:00〜18:00',
    checkin: '15:00〜18:00',
    checkout: '〜10:00',
    bookingNo: '家族内共有メモで確認',
    representative: '家族内共有'
  }
};

const URLS = {
  hotel: 'https://stayyufuin.com/amber-yufuin/',
  hotelBBQ: 'https://stayyufuin.com/bbq/',
  hotelFAQ: 'https://stayyufuin.com/faq/',
  insurance: 'https://www.mhlw.go.jp/stf/newpage_50657.html',
  aeon: 'https://tenpo.aeon-kyushu.info/detail/yufuin/',
  acoop: 'https://www.acoop-kyushu.jp/store/archives/13',
  nexco: 'https://www.w-nexco.co.jp/realtime/',
  ihighwayKyushu: 'https://ihighway.jp/pcsite/map/?area=area09',
  yufuAccess: 'https://www.city.yufu.oita.jp/access/',
  jmaNormal: 'https://www.data.jma.go.jp/stats/etrn/view/nml_amd_d.php?block_no=0799&day=&month=11&prec_no=83&view=p1&year=',
  jmaForecastOita: 'https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=440000',
  yufuinInfo: 'https://yufuin.gr.jp/',
  kinrin: 'https://yufuin.gr.jp/spot/spot-1268/',
  kinrinFeature: 'https://yufuin.gr.jp/feature/feature-1981/',
  sagiridai: 'https://yufuin.gr.jp/spot/spot-1269/',
  unagihime: 'https://yufuin.gr.jp/spot/spot-1274/',
  oitaMorningMist: 'https://edit.pref.oita.jp/series/jikan/73/',
  visitOitaKinrin: 'https://www.visit-oita.jp/spots/detail/4362'
};

const MAPS = {
  amberSearch: 'https://www.google.com/maps/search/?api=1&query=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12',
  amberEmbed: 'https://www.google.com/maps?q=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&output=embed',
  aeonSearch: 'https://www.google.com/maps/search/?api=1&query=%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E4%B8%8A2924-1',
  aeonEmbed: 'https://www.google.com/maps?q=%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97&output=embed',
  acoopSearch: 'https://www.google.com/maps/search/?api=1&query=A%E3%82%B3%E3%83%BC%E3%83%97%E3%82%86%E3%81%B5%E3%81%84%E3%82%93%E5%BA%97',
  kinrinSearch: 'https://www.google.com/maps/search/?api=1&query=%E9%87%91%E9%B1%97%E6%B9%96%20%E7%94%B1%E5%B8%83%E9%99%A2',
  kinrinEmbed: 'https://www.google.com/maps?q=%E9%87%91%E9%B1%97%E6%B9%96%20%E7%94%B1%E5%B8%83%E9%99%A2&output=embed',
  sagiridaiSearch: 'https://www.google.com/maps/search/?api=1&query=%E7%8B%AD%E9%9C%A7%E5%8F%B0%20%E7%94%B1%E5%B8%83%E9%99%A2',
  sagiridaiEmbed: 'https://www.google.com/maps?q=%E7%8B%AD%E9%9C%A7%E5%8F%B0%20%E7%94%B1%E5%B8%83%E9%99%A2&output=embed',
  fukumashoToAmber: 'https://www.google.com/maps/dir/?api=1&origin=%E5%85%AB%E4%BB%A3%E5%B8%82%E7%A6%8F%E6%AD%A3%E7%94%BA&destination=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&travelmode=driving',
  tanakahigashiToAmber: 'https://www.google.com/maps/dir/?api=1&origin=%E5%85%AB%E4%BB%A3%E5%B8%82%E7%94%B0%E4%B8%AD%E6%9D%B1%E7%94%BA&destination=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&travelmode=driving',
  hayamaToAmber: 'https://www.google.com/maps/dir/?api=1&origin=%E5%8C%97%E4%B9%9D%E5%B7%9E%E5%B8%82%E5%B0%8F%E5%80%89%E5%8D%97%E5%8C%BA%E8%91%89%E5%B1%B1%E7%94%BA&destination=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&travelmode=driving',
  aeonToAmber: 'https://www.google.com/maps/dir/?api=1&origin=%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97&destination=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&travelmode=driving',
  amberToKinrin: 'https://www.google.com/maps/dir/?api=1&origin=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&destination=%E9%87%91%E9%B1%97%E6%B9%96%20%E7%94%B1%E5%B8%83%E9%99%A2&travelmode=driving',
  amberToSagiridai: 'https://www.google.com/maps/dir/?api=1&origin=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&destination=%E7%8B%AD%E9%9C%A7%E5%8F%B0&travelmode=driving',
  kusuSa: 'https://www.google.com/maps/search/?api=1&query=%E7%8E%96%E7%8F%A0SA',
  yamadaSa: 'https://www.google.com/maps/search/?api=1&query=%E5%B1%B1%E7%94%B0SA',
  beppuwanSa: 'https://www.google.com/maps/search/?api=1&query=%E5%88%A5%E5%BA%9C%E6%B9%BESA',
  yufudakePa: 'https://www.google.com/maps/search/?api=1&query=%E7%94%B1%E5%B8%83%E5%B2%B3PA'
};

const SHOPPING = [
  {id:'beef', legacyIndex:0, group:'肉・魚介', item:'牛焼肉用', amount:'900g〜1.1kg', owner:'持ち寄り＋不足は現地', priority:'必須'},
  {id:'pork', legacyIndex:1, group:'肉・魚介', item:'豚バラ・豚肩ロース', amount:'500〜600g', owner:'持ち寄り', priority:'必須'},
  {id:'chicken', legacyIndex:2, group:'肉・魚介', item:'鶏もも・せせり', amount:'500〜700g', owner:'北九州車候補', priority:'必須'},
  {id:'sausage', legacyIndex:3, group:'肉・魚介', item:'ソーセージ', amount:'300g前後', owner:'現地補充', priority:'あると便利'},
  {id:'shrimp', legacyIndex:4, group:'肉・魚介', item:'エビ', amount:'8〜12尾', owner:'北九州車候補', priority:'おすすめ'},
  {id:'scallop', legacyIndex:5, group:'肉・魚介', item:'ホタテまたはイカ', amount:'500g前後', owner:'北九州車候補', priority:'おすすめ'},
  {id:'salmon', legacyIndex:6, group:'肉・魚介', item:'鮭切り身', amount:'4切れ', owner:'現地補充', priority:'年配の方向け'},
  {id:'mentaiko', legacyIndex:7, group:'肉・魚介', item:'明太子', amount:'1パック', owner:'北九州車候補', priority:'お土産感'},
  {id:'onion', legacyIndex:8, group:'野菜・副菜', item:'玉ねぎ', amount:'3個', owner:'現地補充', priority:'必須'},
  {id:'pepper', legacyIndex:9, group:'野菜・副菜', item:'ピーマン・パプリカ', amount:'6〜8個', owner:'現地補充', priority:'必須'},
  {id:'eggplant', legacyIndex:10, group:'野菜・副菜', item:'なす', amount:'3本', owner:'現地補充', priority:'おすすめ'},
  {id:'pumpkin', legacyIndex:11, group:'野菜・副菜', item:'かぼちゃ', amount:'1/4個', owner:'現地補充', priority:'おすすめ'},
  {id:'shiitake', legacyIndex:12, group:'野菜・副菜', item:'しいたけ', amount:'2パック', owner:'大分らしく現地', priority:'おすすめ'},
  {id:'mushrooms', legacyIndex:13, group:'野菜・副菜', item:'エリンギ・しめじ', amount:'各1〜2パック', owner:'現地補充', priority:'ホイル焼き'},
  {id:'corn', legacyIndex:14, group:'野菜・副菜', item:'とうもろこし', amount:'4本', owner:'現地補充', priority:'盛り上がり'},
  {id:'tomato', legacyIndex:15, group:'野菜・副菜', item:'ミニトマト', amount:'2パック', owner:'持ち寄り候補', priority:'口直し'},
  {id:'salad', legacyIndex:16, group:'野菜・副菜', item:'サラダ野菜', amount:'1〜2袋', owner:'現地補充', priority:'口直し'},
  {id:'edamame', legacyIndex:17, group:'野菜・副菜', item:'枝豆', amount:'2袋', owner:'現地補充', priority:'お酒を飲む方向け'},
  {id:'rice', legacyIndex:18, group:'主食・朝食', item:'パックご飯', amount:'10〜12個', owner:'現地補充', priority:'必須'},
  {id:'rice-seasoning', legacyIndex:19, group:'主食・朝食', item:'焼きおにぎり用味噌・醤油', amount:'各1', owner:'持ち寄り', priority:'締め'},
  {id:'soup', legacyIndex:20, group:'主食・朝食', item:'インスタント味噌汁・スープ', amount:'12食分', owner:'持ち寄り', priority:'必須'},
  {id:'bread', legacyIndex:21, group:'主食・朝食', item:'パン', amount:'8〜12個分', owner:'持ち寄り候補', priority:'朝食'},
  {id:'eggs', legacyIndex:22, group:'主食・朝食', item:'卵', amount:'10個', owner:'現地補充', priority:'朝食'},
  {id:'yogurt', legacyIndex:23, group:'主食・朝食', item:'ヨーグルト', amount:'8個', owner:'現地補充', priority:'朝食'},
  {id:'fruit', legacyIndex:24, group:'主食・朝食', item:'果物', amount:'8人分', owner:'持ち寄り候補', priority:'朝食・デザート'},
  {id:'sauce-mild', legacyIndex:25, group:'調味料・消耗品', item:'焼肉のたれ（味の指定は要確認）', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {id:'sauce-spicy', legacyIndex:26, group:'調味料・消耗品', item:'焼肉のたれ 辛口/にんにく系', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {id:'ponzu', legacyIndex:27, group:'調味料・消耗品', item:'ポン酢', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {id:'lemon', legacyIndex:28, group:'調味料・消耗品', item:'レモン・レモン汁', amount:'1', owner:'現地補充', priority:'魚介用'},
  {id:'oil-butter', legacyIndex:29, group:'調味料・消耗品', item:'油・バター', amount:'各1', owner:'持ち寄り', priority:'必須'},
  {id:'yuzu', legacyIndex:30, group:'調味料・消耗品', item:'柚子こしょう', amount:'1本', owner:'持ち寄り', priority:'大分らしく'},
  {id:'foil', legacyIndex:31, group:'調味料・消耗品', item:'アルミホイル', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {id:'wrap-bags', legacyIndex:32, group:'調味料・消耗品', item:'ラップ', amount:'各1', owner:'持ち寄り', priority:'必須'},
  {id:'kitchen-paper', legacyIndex:33, group:'調味料・消耗品', item:'キッチンペーパー', amount:'2ロール', owner:'現地補充', priority:'必須'},
  {id:'wipes', legacyIndex:34, group:'調味料・消耗品', item:'ウェットティッシュ', amount:'2〜3個', owner:'現地補充', priority:'必須'},
  {id:'gloves', legacyIndex:35, group:'調味料・消耗品', item:'使い捨て手袋', amount:'1箱', owner:'持ち寄り', priority:'生肉用'},
  {id:'beer', legacyIndex:36, group:'飲み物', item:'ビール・発泡酒', amount:'350ml×16〜18本', owner:'持ち寄り＋現地', priority:'お酒を飲む方向け'},
  {id:'canned-drinks', legacyIndex:37, group:'飲み物', item:'ハイボール・チューハイ', amount:'350ml×8本', owner:'現地補充', priority:'お酒を飲む方向け'},
  {id:'shochu', legacyIndex:38, group:'飲み物', item:'焼酎', amount:'720ml×1本', owner:'持ち寄り候補', priority:'お土産感'},
  {id:'wine', legacyIndex:39, group:'飲み物', item:'日本酒またはワイン', amount:'1本', owner:'持ち寄り', priority:'食後用'},
  {id:'soda', legacyIndex:40, group:'飲み物', item:'炭酸水', amount:'500ml×6〜8本', owner:'現地補充', priority:'割り材'},
  {id:'ice', legacyIndex:41, group:'飲み物', item:'氷', amount:'2kg×2袋', owner:'現地補充', priority:'必須'},
  {id:'water', legacyIndex:42, group:'飲み物', item:'水', amount:'2L×3本', owner:'現地補充', priority:'必須'},
  {id:'tea', legacyIndex:43, group:'飲み物', item:'お茶', amount:'2L×3本', owner:'現地補充', priority:'必須'},
  {id:'nonalcohol', legacyIndex:44, group:'飲み物', item:'ノンアルビール', amount:'350ml×6本', owner:'現地補充', priority:'乾杯用'},
  {id:'coffee', legacyIndex:45, group:'飲み物', item:'コーヒー・緑茶', amount:'8人分以上', owner:'持ち寄り', priority:'夜・朝'},
  {id:'pajamas', legacyIndex:46, group:'個人持ち物', item:'パジャマ・部屋着', amount:'各自', owner:'全員', priority:'宿になし'},
  {id:'warm-clothes', legacyIndex:47, group:'個人持ち物', item:'上着・ひざ掛け・厚手靴下', amount:'各自', owner:'全員', priority:'11月の寒さ'},
  {id:'medicine', legacyIndex:48, group:'個人持ち物', item:'常備薬・マイナ保険証または資格確認書', amount:'各自', owner:'全員', priority:'必須'},
  {id:'charger', legacyIndex:49, group:'個人持ち物', item:'充電器・モバイルバッテリー', amount:'各自', owner:'全員', priority:'必須'},
  {id:'cooler', legacyIndex:50, group:'個人持ち物', item:'クーラーボックス・保冷剤', amount:'各車', owner:'各車', priority:'要冷蔵用'},
  {id:'pickles', group:'野菜・副菜', item:'漬物・キムチ', amount:'希望者分', owner:'担当未定', priority:'候補'},
  {id:'bags', group:'調味料・消耗品', item:'保存袋', amount:'1箱', owner:'持ち寄り候補', priority:'候補'},
  {id:'trash-bags', group:'調味料・消耗品', item:'ゴミ袋', amount:'分別ルール・備付けを宿に確認', owner:'総合代表が確認', priority:'要確認'},
  {id:'paper-plates', group:'調味料・消耗品', item:'予備紙皿・紙コップ', amount:'必要な場合のみ', owner:'担当未定', priority:'候補'},
  {id:'underwear', group:'個人持ち物', item:'下着・靴下', amount:'各自', owner:'全員', priority:'必須'},
  {id:'assistive-items', group:'個人持ち物', item:'眼鏡・補聴器電池・杖など', amount:'必要なもの', owner:'各自', priority:'候補'},
];

// idとlegacyIndexは変更しない。旧版のチェックを一度だけ引き継ぐための対応表。
SHOPPING.forEach(item => {
  item.supply = ['sauce-mild', 'foil', 'wrap-bags'].includes(item.id) ? '宿に備付け' :
    item.priority === '要確認' ? '確認待ち' : /必須|宿になし|要冷蔵|寒さ/.test(item.priority) ? '持参必須' : '候補';
  if (item.supply === '宿に備付け') item.owner = '公式案内あり・数量は宿に確認';
  if (['beer', 'canned-drinks', 'shochu', 'wine'].includes(item.id)) {
    item.amount = '候補量：' + item.amount + '（希望者で調整）';
    item.supply = '確認待ち';
    item.owner = '希望者・数量・担当を家族LINEで確認';
  }
});

const LINK_GROUPS = [
  {title:'宿・チェックイン', items:[
    {label:'AMBER Yufuin 公式', url:URLS.hotel, note:'住所・駐車場・Wi-Fi・チェックイン情報'},
    {label:'宿のFAQ', url:URLS.hotelFAQ, note:'パジャマなし・火器の持ち込み不可'},
    {label:'STAY YUFUIN BBQ案内', url:URLS.hotelBBQ, note:'BBQスペース・器材確認'},
    {label:'AMBER YufuinをGoogleマップで開く', url:MAPS.amberSearch, note:'当日ナビ用'},
    {label:'宿へ電話', url:'tel:0977759238', note:'受付9:00〜18:00／遅れる場合は連絡'}
  ]},
  {title:'買い出し', items:[
    {label:'イオン湯布院店 公式', url:URLS.aeon, note:'9:00〜22:00（2026-10-10公式確認）。必要時の不足分補充候補'},
    {label:'イオン湯布院店 Googleマップ', url:MAPS.aeonSearch, note:'チェックイン後、必要な場合のみ利用'},
    {label:'Aコープゆふいん店 公式', url:URLS.acoop, note:'10:00〜19:00（2026-10-10公式確認）。地元野菜候補'},
    {label:'Aコープゆふいん店 Googleマップ', url:MAPS.acoopSearch, note:'サブ候補'}
  ]},
  {title:'道路・天気・交通', items:[
    {label:'NEXCO西日本 リアルタイム交通情報', url:URLS.nexco, note:'九州道・東九州道・大分道の通行止め/規制確認'},
    {label:'iHighway 九州沖縄', url:URLS.ihighwayKyushu, note:'高速道路地図で確認'},
    {label:'気象庁 大分県天気予報', url:URLS.jmaForecastOita, note:'旅行1週間前〜当日に確認'},
    {label:'気象庁 湯布院11月平年値', url:URLS.jmaNormal, note:'防寒の目安'},
    {label:'由布市アクセス・タクシー', url:URLS.yufuAccess, note:'予備交通手段'}
  ]},
  {title:'観光・読み物', items:[
    {label:'YUFUINFO 公式旅ガイド', url:URLS.yufuinInfo, note:'湯布院・庄内・挾間公式観光'},
    {label:'金鱗湖 公式スポット', url:URLS.kinrin, note:'朝霧・散策・由来'},
    {label:'狭霧台 公式スポット', url:URLS.sagiridai, note:'由布院盆地一望'},
    {label:'宇奈岐日女神社 公式スポット', url:URLS.unagihime, note:'六所様・由布院の古い信仰'},
    {label:'由布院の朝霧 読み物', url:URLS.oitaMorningMist, note:'朝霧と伝説'}
  ]}
];

window.TRIP = TRIP;
window.URLS = URLS;
window.MAPS = MAPS;
window.SHOPPING = SHOPPING;
window.LINK_GROUPS = LINK_GROUPS;

const PLANS = {
  a: {
    label: 'プランA：通常・晴れ／曇り', departures: {yatsushiro:'10:00', kokura:'12:00'}, bbq: '18:00',
    description: '通常の移動案。途中休憩を取り、15:00に宿へ集合します。時刻は案です。',
    events: [
      ['10:00','八代2台 出発','福正町／田中東町。途中2回休憩。'],
      ['12:00','小倉南区葉山町 出発','昼食は出発前に軽く。'],
      ['15:00','AMBER Yufuin 集合・チェックイン','部屋割り、冷蔵庫、温泉導線を確認。'],
      ['15:30','持ち寄り量を確認','必要な場合のみ不足分を購入。'],
      ['16:00','温泉・BBQ準備','お酒を飲む前に温泉を済ませます。'],
      ['18:00','BBQ開始','焼き係は30分交代。'],
      ['19:30','片付け・集合写真','体調に合わせて休憩。'],
      ['20:30','家族時間・温泉は各自の体調に合わせて','お酒を飲んだ後の長湯は避けます。']
    ]
  },
  b: {
    label: 'プランB：雨・渋滞・体調優先', departures: {yatsushiro:'09:30', kokura:'11:30'}, bbq:'18:30',
    description: '早め出発は前日〜出発前に決める案です。移動中に切り替える場合は、実際の到着見込みを共有し、安全と休憩を優先します。',
    events: [
      ['09:30','八代2台 早め出発（出発前に判断）','休憩の余白を確保。'],
      ['11:30','小倉南区葉山町 早め出発（出発前に判断）','別府湾SAなどで休憩。'],
      ['15:00','AMBER Yufuin 集合目標・チェックイン','遅れる場合は宿へ連絡。'],
      ['15:30','休憩・必要時のみ買い出し','年配の方は宿で休み、担当者だけ移動。'],
      ['16:00','温泉・BBQ準備','お酒を飲む前に温泉を済ませます。'],
      ['18:30','短縮BBQ','強雨・強風時の利用可否は宿に確認。無理せず室内の食事に切替。'],
      ['20:00','室内中心の家族時間','屋外滞在は無理しない。']
    ]
  }
};
const ROLES = [
  ['総合代表','宿連絡・支払い・チェックイン情報管理・プラン変更の取りまとめ'],
  ['各車の連絡担当','休憩と到着見込みを共有。無理な隊列走行はしない'],
  ['買い出し','持参量と不足分を確認し、必要な場合だけ購入'],
  ['記録・共有','写真・BGM・家族LINEでの連絡'],
  ['焼き係','30分交代で担当'],
  ['年配の方のサポート','椅子・防寒・温泉・夜間移動・体調確認']
];
const SAFETY = [
  '生肉用トングと食べる箸は分ける。',
  '運転する方は、宿到着後に運転が完全に終わってからお酒を飲みます。',
  '翌朝運転する方は、夜のお酒を早めに切り上げます。',
  '温泉前後は水分補給をします。お酒を飲んだ後の長湯は避けます。'
];
window.PLANS = PLANS;
window.ROLES = ROLES;
window.SAFETY = SAFETY;
