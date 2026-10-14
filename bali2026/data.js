export const spots=[
{id:'sindhu',name:'シンドゥ夜市（番外編）',en:'Pasar Sindhu Night Market Sanur Bali',desc:'番外編・行程外 · サヌールの夜市'},
{id:'uluwatu',name:'ウルワツ寺院',en:'Uluwatu Temple Bali',desc:'15日夜 · 断崖の景色とケチャ'},
{id:'sahadewa',name:'サハデワ公演会場',en:'Sahadewa Barong and Keris Dance Batubulan Bali',desc:'16日朝 · バロンとガムラン'},
{id:'batuan',name:'バトゥアン寺院',en:'Pura Puseh Desa Batuan Bali',desc:'16日 · 石彫と寺院建築'},
{id:'ubud',name:'ウブド王宮',en:'Ubud Palace Bali',desc:'16日昼 · 王宮周辺と市場を散策'},
{id:'airport',name:'デンパサール空港',en:'I Gusti Ngurah Rai International Airport International Departures',desc:'16日18:40到着目標 · 国際線'},
{id:'hyatt',name:'グランドハイアット・バリ',en:'Grand Hyatt Bali Nusa Dua',desc:'学会会場 · 15日の集合起点'},
{id:'mercure',name:'メルキュール・バリ・ヌサドゥア',en:'Mercure Bali Nusa Dua',desc:'白濵・渡邉の宿泊先'},
{id:'pasar',name:'パサール・センゴール',en:'Pasar Senggol Grand Hyatt Bali',desc:'15日夜の代案 · 食事と伝統舞踊'}];
export const resources=[
{kind:'KECAK / TICKET',title:'ウルワツ・ケチャ',desc:'19:00の第2公演を扱う販売ページ。10月15日の開催・空席、入場と送迎の範囲を確認。',url:'https://www.tiket.com/en-us/to-do/activity-kecak-uluwatu',label:'販売案内を見る'},
{kind:'BARONG / TICKET',title:'サハデワ：バロン＆クリス',desc:'9:30〜10:30公演の販売案内。10月16日の開催・空席を確認して予約。',url:'https://www.traveloka.com/id-id/activities/indonesia/product/barong-keris-dance-sahadewa-batubulan-6776207072786',label:'販売案内を見る'},
{kind:'PLAN B / OFFICIAL',title:'パサール・センゴール',desc:'木曜夜の営業と文化公演を案内。15日の演目・生ガムラン・税込料金を確認。',url:'https://www.hyatt.com/grand-hyatt/en-US/balgh-grand-hyatt-bali/dining/pasar-senggol',label:'ホテル公式を見る'},
{kind:'STAY / OFFICIAL',title:'メルキュール・バリ・ヌサドゥア',desc:'車の手配、朝のチェックアウト、荷物の扱いをフロントに相談。',url:'https://all.accor.com/hotel/8006/index.en.shtml',label:'ホテル公式を見る'},
{kind:'FLIGHT / OFFICIAL',title:'シンガポール航空',desc:'SQ947の運航・チェックイン・手荷物条件は、航空会社と最新の予約で確認。',url:'https://www.singaporeair.com/',label:'航空会社を開く'},
{kind:'READ BEFORE YOU GO',title:'ケチャについて',desc:'ケチャは主に男性の合唱でリズムを作る舞踊劇。楽器のガムランは翌朝のバロンで楽しむ。',url:'https://www.indonesia.travel/id/en/destination/bali-nusa-tenggara/bali/ubud---kecak-dance',label:'観光公式の解説を見る'}];
export const days={
'15':{title:'ウルワツの夜',intro:'セッションを終えたら、島の南西へ。ケチャの声と炎を楽しむ夜。夕景と寺院見学は到着時刻に合わせて。',events:[
['14:30–16:30','学会セッション','会場：グランドハイアット・バリ。終了後に挨拶・写真撮影。','hyatt',''],
['16:30–17:00','集合・専用車で出発','集合場所は相談して決定。往復の車をまとめて手配する想定。','hyatt','要手配'],
['17:00–18:30','ウルワツへ移動・寺院見学','明るさが残っていれば断崖と寺院周辺へ。夕日に間に合うかは交通次第。','uluwatu',''],
['19:00–20:00','ケチャ＆ファイヤーダンス','第2公演を予約する想定。15日の開催と空席を確認してから車を手配。','uluwatu','要確認'],
['公演後','夕食・ホテルへ','食事場所と帰着時刻は運転手・同行者と相談。ホテルで翌朝の準備。','mercure','']
]},
'16':{title:'響きと寺院、ウブド',intro:'ガムラン伴奏の舞踊を聴き、寺院と街を歩く。荷物を積んだ車で観光して、そのまま空港へ。',events:[
['07:30頃','朝にチェックアウト・出発','ホテルの朝食・精算と所要時間を踏まえ、運転手と出発時刻を調整。','mercure','要調整'],
['09:30–10:30','バロン＆クリスダンス','バトゥブランのサハデワ公演を候補に。16日の開催・空席を確認。','sahadewa','要確認'],
['11:00頃','バトゥアン寺院','石彫や建築を見学。入場条件・サロンの利用を現地で確認。','batuan',''],
['12:00–14:00','ウブドで昼食・街歩き','王宮周辺や市場を中心に短めの散策。棚田や滝は追加せず、訪問先を絞る。','ubud',''],
['14:00頃','ウブドを出発・南部へ','途中で休憩と早めの夕食。渋滞時は観光を短縮して空港を優先。','airport','早めに出発'],
['18:40目標','空港到着・搭乗手続き','白濵・渡邉の旅程は21:40発SQ947。中谷先生の帰国便と解散場所は別途相談。','airport',''],
['21:40','SQ947：シンガポールへ','最新の航空券・運航情報で確認。シンガポールで福岡便へ乗り継ぎ。','airport','']
]}};
export const checks=['15日19:00のケチャの開催・空席を確認','16日9:30のバロンの開催・空席を確認','チケットの入場・送迎・キャンセル条件を確認','3名分の車・待機・荷物・空港送迎・料金を相談','15日の集合場所と時間を決定','中谷先生の宿泊先・帰国便・解散場所を確認','16日朝のチェックアウトと朝食を確認','帰国便の時刻とチェックイン条件を確認'];
export const spot=id=>spots.find(s=>s.id===id);
export const mapUrl=id=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(spot(id).en);
export const directions=id=>'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(spot(id).en)+'&travelmode=driving';
export function routeUrl(ids){return 'https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(spot(ids[0]).en)+'&destination='+encodeURIComponent(spot(ids.at(-1)).en)+'&waypoints='+encodeURIComponent(ids.slice(1,-1).map(id=>spot(id).en).join('|'))+'&travelmode=driving'}
export function shareText(memo=''){return 'バリ文化観光プラン（提案・未予約）\n全時刻はバリ現地時間。\n\n'+Object.entries(days).map(([day,d])=>`10月${day}日：${d.title}\n`+d.events.map(e=>`${e[0]} ${e[1]}`).join('\n')).join('\n\n')+'\n\n公演の開催・空席と車の手配は要確認。16日は14時頃にウブド出発、18:40空港到着目標。\n'+(memo?'\n相談メモ：\n'+memo:'')}
