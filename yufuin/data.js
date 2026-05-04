/* 旅行しおりの主要データ。日程変更時はこのファイルの時刻・持ち物・リンクを更新すると反映しやすいです。 */
const TRIP = {
  dateLabel: '2026年11月7日（土）〜8日（日）',
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
  fukumashoToAeon: 'https://www.google.com/maps/dir/?api=1&origin=%E5%85%AB%E4%BB%A3%E5%B8%82%E7%A6%8F%E6%AD%A3%E7%94%BA&destination=%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97&travelmode=driving',
  tanakahigashiToAeon: 'https://www.google.com/maps/dir/?api=1&origin=%E5%85%AB%E4%BB%A3%E5%B8%82%E7%94%B0%E4%B8%AD%E6%9D%B1%E7%94%BA&destination=%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97&travelmode=driving',
  hayamaToAeon: 'https://www.google.com/maps/dir/?api=1&origin=%E5%8C%97%E4%B9%9D%E5%B7%9E%E5%B8%82%E5%B0%8F%E5%80%89%E5%8D%97%E5%8C%BA%E8%91%89%E5%B1%B1%E7%94%BA&destination=%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97&travelmode=driving',
  aeonToAmber: 'https://www.google.com/maps/dir/?api=1&origin=%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97&destination=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&travelmode=driving',
  amberToKinrin: 'https://www.google.com/maps/dir/?api=1&origin=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&destination=%E9%87%91%E9%B1%97%E6%B9%96%20%E7%94%B1%E5%B8%83%E9%99%A2&travelmode=driving',
  amberToSagiridai: 'https://www.google.com/maps/dir/?api=1&origin=AMBER%20Yufuin%20%E5%A4%A7%E5%88%86%E7%9C%8C%E7%94%B1%E5%B8%83%E5%B8%82%E6%B9%AF%E5%B8%83%E9%99%A2%E7%94%BA%E5%B7%9D%E5%8D%97839-12&destination=%E7%8B%AD%E9%9C%A7%E5%8F%B0&travelmode=driving',
  kusuSa: 'https://www.google.com/maps/search/?api=1&query=%E7%8E%96%E7%8F%A0SA',
  yamadaSa: 'https://www.google.com/maps/search/?api=1&query=%E5%B1%B1%E7%94%B0SA',
  beppuwanSa: 'https://www.google.com/maps/search/?api=1&query=%E5%88%A5%E5%BA%9C%E6%B9%BESA',
  yufudakePa: 'https://www.google.com/maps/search/?api=1&query=%E7%94%B1%E5%B8%83%E5%B2%B3PA'
};

const SHOPPING = [
  {group:'肉・魚介', item:'牛焼肉用', amount:'900g〜1.1kg', owner:'持ち寄り＋不足は現地', priority:'必須'},
  {group:'肉・魚介', item:'豚バラ・豚肩ロース', amount:'500〜600g', owner:'持ち寄り', priority:'必須'},
  {group:'肉・魚介', item:'鶏もも・せせり', amount:'500〜700g', owner:'北九州車候補', priority:'必須'},
  {group:'肉・魚介', item:'ソーセージ', amount:'300g前後', owner:'現地補充', priority:'あると便利'},
  {group:'肉・魚介', item:'エビ', amount:'8〜12尾', owner:'北九州車候補', priority:'おすすめ'},
  {group:'肉・魚介', item:'ホタテまたはイカ', amount:'500g前後', owner:'北九州車候補', priority:'おすすめ'},
  {group:'肉・魚介', item:'鮭切り身', amount:'4切れ', owner:'現地補充', priority:'年配の方向け'},
  {group:'肉・魚介', item:'明太子', amount:'1パック', owner:'北九州車候補', priority:'お土産感'},
  {group:'野菜・副菜', item:'玉ねぎ', amount:'3個', owner:'現地補充', priority:'必須'},
  {group:'野菜・副菜', item:'ピーマン・パプリカ', amount:'6〜8個', owner:'現地補充', priority:'必須'},
  {group:'野菜・副菜', item:'なす', amount:'3本', owner:'現地補充', priority:'おすすめ'},
  {group:'野菜・副菜', item:'かぼちゃ', amount:'1/4個', owner:'現地補充', priority:'おすすめ'},
  {group:'野菜・副菜', item:'しいたけ', amount:'2パック', owner:'大分らしく現地', priority:'おすすめ'},
  {group:'野菜・副菜', item:'エリンギ・しめじ', amount:'各1〜2パック', owner:'現地補充', priority:'ホイル焼き'},
  {group:'野菜・副菜', item:'とうもろこし', amount:'4本', owner:'現地補充', priority:'盛り上がり'},
  {group:'野菜・副菜', item:'ミニトマト', amount:'2パック', owner:'持ち寄り候補', priority:'口直し'},
  {group:'野菜・副菜', item:'サラダ野菜', amount:'1〜2袋', owner:'現地補充', priority:'口直し'},
  {group:'野菜・副菜', item:'枝豆', amount:'2袋', owner:'現地補充', priority:'お酒を飲む方向け'},
  {group:'主食・朝食', item:'パックご飯', amount:'10〜12個', owner:'現地補充', priority:'必須'},
  {group:'主食・朝食', item:'焼きおにぎり用味噌・醤油', amount:'各1', owner:'持ち寄り', priority:'締め'},
  {group:'主食・朝食', item:'インスタント味噌汁・スープ', amount:'12食分', owner:'持ち寄り', priority:'必須'},
  {group:'主食・朝食', item:'パン', amount:'8〜12個分', owner:'持ち寄り候補', priority:'朝食'},
  {group:'主食・朝食', item:'卵', amount:'10個', owner:'現地補充', priority:'朝食'},
  {group:'主食・朝食', item:'ヨーグルト', amount:'8個', owner:'現地補充', priority:'朝食'},
  {group:'主食・朝食', item:'果物', amount:'8人分', owner:'持ち寄り候補', priority:'朝食・デザート'},
  {group:'調味料・消耗品', item:'焼肉のたれ 甘口', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {group:'調味料・消耗品', item:'焼肉のたれ 辛口/にんにく系', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {group:'調味料・消耗品', item:'ポン酢', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {group:'調味料・消耗品', item:'レモン・レモン汁', amount:'1', owner:'現地補充', priority:'魚介用'},
  {group:'調味料・消耗品', item:'油・バター', amount:'各1', owner:'持ち寄り', priority:'必須'},
  {group:'調味料・消耗品', item:'柚子こしょう', amount:'1本', owner:'持ち寄り', priority:'大分らしく'},
  {group:'調味料・消耗品', item:'アルミホイル', amount:'1本', owner:'持ち寄り', priority:'必須'},
  {group:'調味料・消耗品', item:'ラップ・保存袋', amount:'各1', owner:'持ち寄り', priority:'必須'},
  {group:'調味料・消耗品', item:'キッチンペーパー', amount:'2ロール', owner:'現地補充', priority:'必須'},
  {group:'調味料・消耗品', item:'ウェットティッシュ', amount:'2〜3個', owner:'現地補充', priority:'必須'},
  {group:'調味料・消耗品', item:'使い捨て手袋', amount:'1箱', owner:'持ち寄り', priority:'生肉用'},
  {group:'飲み物', item:'ビール・発泡酒', amount:'350ml×16〜18本', owner:'持ち寄り＋現地', priority:'お酒を飲む方向け'},
  {group:'飲み物', item:'ハイボール・チューハイ', amount:'350ml×8本', owner:'現地補充', priority:'お酒を飲む方向け'},
  {group:'飲み物', item:'焼酎', amount:'720ml×1本', owner:'持ち寄り候補', priority:'お土産感'},
  {group:'飲み物', item:'日本酒またはワイン', amount:'1本', owner:'持ち寄り', priority:'食後用'},
  {group:'飲み物', item:'炭酸水', amount:'500ml×6〜8本', owner:'現地補充', priority:'割り材'},
  {group:'飲み物', item:'氷', amount:'2kg×2袋', owner:'現地補充', priority:'必須'},
  {group:'飲み物', item:'水', amount:'2L×3本', owner:'現地補充', priority:'必須'},
  {group:'飲み物', item:'お茶', amount:'2L×3本', owner:'現地補充', priority:'必須'},
  {group:'飲み物', item:'ノンアルビール', amount:'350ml×6本', owner:'現地補充', priority:'乾杯用'},
  {group:'飲み物', item:'コーヒー・緑茶', amount:'8人分以上', owner:'持ち寄り', priority:'夜・朝'},
  {group:'個人持ち物', item:'パジャマ・部屋着', amount:'各自', owner:'全員', priority:'宿になし'},
  {group:'個人持ち物', item:'上着・ひざ掛け・厚手靴下', amount:'各自', owner:'全員', priority:'11月の寒さ'},
  {group:'個人持ち物', item:'常備薬・保険証/マイナカード', amount:'各自', owner:'全員', priority:'必須'},
  {group:'個人持ち物', item:'充電器・モバイルバッテリー', amount:'各自', owner:'全員', priority:'必須'},
  {group:'個人持ち物', item:'クーラーボックス・保冷剤', amount:'各車', owner:'各車', priority:'要冷蔵用'},
];

const LINK_GROUPS = [
  {title:'宿・チェックイン', items:[
    {label:'AMBER Yufuin 公式', url:URLS.hotel, note:'住所・駐車場・Wi-Fi・チェックイン情報'},
    {label:'STAY YUFUIN BBQ案内', url:URLS.hotelBBQ, note:'BBQスペース・器材確認'},
    {label:'AMBER YufuinをGoogleマップで開く', url:MAPS.amberSearch, note:'当日ナビ用'},
    {label:'宿へ電話', url:'tel:0977759238', note:'受付9:00〜18:00／遅れる場合は連絡'}
  ]},
  {title:'買い出し', items:[
    {label:'イオン湯布院店 公式', url:URLS.aeon, note:'9:00〜22:00。現地集合の第一候補'},
    {label:'イオン湯布院店 Googleマップ', url:MAPS.aeonSearch, note:'三台合流と不足分補充'},
    {label:'Aコープゆふいん店 公式', url:URLS.acoop, note:'10:00〜19:00。地元野菜候補'},
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
