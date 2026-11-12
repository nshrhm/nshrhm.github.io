"""第11回: 人工画像の特徴抽出と照合。実行はPython標準ライブラリのみ。"""
import argparse
from copy import deepcopy
import json
import math

IMAGE = [[0,0,0,0,0],[0,2,2,2,0],[0,2,9,2,0],[0,2,2,2,0],[0,0,0,0,0]]
SCENE = [[0,0,0,0,0],[0,0,1,2,0],[0,0,3,4,0],[0,0,0,0,0]]
TEMPLATE = [[1,2],[3,4]]
POOL_IMAGE = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]
KERNELS = {'laplacian':[[0,1,0],[1,-4,1],[0,1,0]],
           'sobel_x':[[-1,0,1],[-2,0,2],[-1,0,1]]}

def finite(x, low=-1e6, high=1e6):
    if isinstance(x, bool) or not isinstance(x,(int,float)) or not math.isfinite(x) or not low <= x <= high:
        raise ValueError(f'有限数 {low}〜{high} を指定してください')
    return x

def matrix(a):
    if not isinstance(a, list) or not 1 <= len(a) <= 16 or (not isinstance(a[0], list)) or (not 1 <= len(a[0]) <= 16):
        raise ValueError('行列は1〜16行・列の二重リストです')
    w = len(a[0])
    for row in a:
        if not isinstance(row, list) or len(row) != w:
            raise ValueError('各行の列数をそろえてください')
        for x in row:
            finite(x)
    return (len(a), w)

def tone(image, offset=0):
    matrix(image)
    finite(offset, -255, 255)
    for row in image:
        for x in row:
            finite(x, 0, 255)
    return [[min(255, max(0, x + offset)) for x in row] for row in image]

def binary(image, threshold=1):
    matrix(image)
    finite(threshold, 0, 255)
    return [[int(x > threshold) for x in row] for row in image]

def window(image,row,col,h,w):
    return [line[col:col+w] for line in image[row:row+h]]

def filtering(image, method='mean', *, record=None):
    """3×3窓の値・積・結果を、出力位置と対応させて計算する。"""
    height, width = matrix(image)
    if height < 3 or width < 3:
        raise ValueError('3×3以上の画像を指定してください')
    if method not in ['mean','median','range',*KERNELS]:
        raise ValueError('未知のフィルタです')
    output = []
    for row in range(height-2):
        output_row = []
        for col in range(width-2):
            patch = window(image,row,col,3,3)
            values = [pixel for line in patch for pixel in line]
            products = []
            if method == 'mean':
                value = sum(values)/9
            elif method == 'median':
                value = sorted(values)[4]
            elif method == 'range':
                value = max(values)-min(values)
            else:
                for i in range(3):
                    for j in range(3):
                        products.append(image[row+i][col+j]*KERNELS[method][i][j])
                value = sum(products)
            output_row.append(value)
            if record is not None:
                record({'row':row,'col':col,'patch':patch,'values':values,'products':products,'value':value})
        output.append(output_row)
    return output


def features(mask):
    """1の個数が面積。1の位置の行・列をそれぞれ平均すると重心。"""
    height, width = matrix(mask)
    if any(x not in (0,1) for row in mask for x in row):
        raise ValueError('二値マスクの値は0か1です')
    area = sum(sum(row) for row in mask)
    row_terms, col_terms = [], []
    for row in range(height):
        for col in range(width):
            row_terms.append(row*mask[row][col])
            col_terms.append(col*mask[row][col])
    centroid = None if area == 0 else [sum(row_terms)/area,sum(col_terms)/area]
    rows = [sum(row) for row in mask]
    columns = [sum(mask[row][col] for row in range(height)) for col in range(width)]
    return {'area':area,'centroid':centroid,'rows':rows,'columns':columns}


def pool(image):
    h, w = matrix(image)
    if h % 2 or w % 2:
        raise ValueError('2×2プーリングでは行・列を偶数にしてください')
    return [[max((image[r + i][c + j] for i in range(2) for j in range(2))) for c in range(0, w, 2)] for r in range(0, h, 2)]

def score(patch, template, method='ssd'):
    if matrix(patch) != matrix(template):
        raise ValueError('同じ形のパッチとテンプレートを指定してください')
    a = [x for row in patch for x in row]
    b = [x for row in template for x in row]
    if method == 'ssd':
        return sum(((x - y) ** 2 for x, y in zip(a, b)))
    if method != 'zncc':
        raise ValueError('評価方法はssdかznccです')
    ma = sum(a) / len(a)
    mb = sum(b) / len(b)
    a = [x - ma for x in a]
    b = [x - mb for x in b]
    denominator = math.sqrt(sum((x * x for x in a)) * sum((x * x for x in b)))
    if denominator == 0:
        return None
    return sum((x * y for x, y in zip(a, b))) / denominator

def match(image, template, method='ssd'):
    h, w = matrix(image)
    th, tw = matrix(template)
    if th > h or tw > w:
        raise ValueError('テンプレートは画像以下の大きさにしてください')
    if method not in ('ssd', 'zncc'):
        raise ValueError('評価方法はssdかznccです')
    scores = [[score(window(image, r, c, th, tw), template, method) for c in range(w - tw + 1)] for r in range(h - th + 1)]
    candidates = [(s, r, c) for r, row in enumerate(scores) for c, s in enumerate(row) if s is not None]
    if not candidates:
        return {'scores': scores, 'best': None, 'ties': []}
    value = (min if method == 'ssd' else max)((s for s, r, c in candidates))
    ties = [[r, c] for s, r, c in candidates if abs(s - value) <= 1e-12]
    return {'scores': scores, 'best': {'row': ties[0][0], 'col': ties[0][1], 'score': value}, 'ties': ties}

def rotate(image):
    h,w=matrix(image)
    return [[image[h-1-r][c] for r in range(h)] for c in range(w)]

def rounded(value):
    if isinstance(value,float): return round(value,6)
    if isinstance(value,list): return [rounded(x) for x in value]
    if isinstance(value,dict): return {k:rounded(v) for k,v in value.items()}
    return value

def demo():
    return rounded({'binary':binary(IMAGE),'mean':filtering(IMAGE),'median':filtering(IMAGE,'median'),
      'laplacian':filtering(IMAGE,'laplacian'),'sobel_x':filtering(IMAGE,'sobel_x'),'features':features(binary(IMAGE)),
      'pool':pool(POOL_IMAGE),'ssd':match(SCENE,TEMPLATE),'zncc':match(SCENE,TEMPLATE,'zncc'),
      'brightness_pair':{'ssd':score(tone(TEMPLATE,10),TEMPLATE),'zncc':score(tone(TEMPLATE,10),TEMPLATE,'zncc')},
      'constant_zncc':score([[2,2],[2,2]],TEMPLATE,'zncc')})

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--demo',action='store_true');p.add_argument('--json',action='store_true');args=p.parse_args()
    result=demo()
    if args.json: print(json.dumps(result,ensure_ascii=False))
    else:
        print('人工画像の基準結果。座標は0始まりの行・列です。')
        print(json.dumps(result,ensure_ascii=False,indent=2))


def lesson_binary(threshold=1):
    mask = binary(IMAGE,threshold)
    rows = [(r,c,value,f'{value}>{threshold}',mask[r][c]) for r,line in enumerate(IMAGE) for c,value in enumerate(line)]
    return {'title':'画素の位置と二値化','question':'しきい値と同じ値は1になるか','input':f'5×5画像、しきい値{threshold}',
            'columns':['行','列','画素値','判定','0/1'],'rows':rows,
            'matrices':[('入力画素',IMAGE),('判定後',mask)],'result':f"1の画素数={features(mask)['area']}",
            'comparison':f"しきい値2では面積={features(binary(IMAGE,2))['area']}",
            'explanation':'判定は「より大きい」。同じ値は0。二値化は画像の位置を変えず値を0/1にする。',
            'reset':'threshold=1で再実行。'}


def lesson_filter(method='mean'):
    records = []
    result = filtering(IMAGE,method,record=records.append)
    center = records[4]
    rows = [(i//3,i%3,value) for i,value in enumerate(center['values'])]
    return {'title':'近傍処理：中央の3×3から1値へ','question':'中央の9という外れ値で平均と中央値はどう違うか',
            'input':f'中央窓の開始[1,1]、処理={method}','columns':['窓内行','窓内列','値'],'rows':rows,
            'tables':[('同じ9値で比較',['合計','個数','平均','並べ替えた値','中央値'],[(sum(center['values']),9,sum(center['values'])/9,str(sorted(center['values'])),sorted(center['values'])[4])])],
            'matrices':[('入力',IMAGE),('切り出した3×3',center['patch']),('出力3×3',result)],
            'result':f"出力の行1・列1={center['value']}", 'comparison':f"中央値処理の中央={filtering(IMAGE,'median')[1][1]}",
            'explanation':'窓を1マスずつ動かすため5×5から3×3になる。中央値は合計ではなく、9個を並べた5番目。',
            'reset':"method='mean'で再実行。"}


def lesson_edge(invert=False):
    image = [[9-x for x in row] for row in IMAGE] if invert else deepcopy(IMAGE)
    records = []
    output = filtering(image,'laplacian',record=records.append)
    center = records[4]
    rows = [(i//3,i%3,center['values'][i],KERNELS['laplacian'][i//3][i%3],product) for i,product in enumerate(center['products'])]
    return {'title':'符号付きのエッジ：積を足す','question':'明暗を逆にすると符号はどうなるか',
            'input':f'中央3×3、明暗反転={invert}','columns':['行','列','画素','重み','積'],'rows':rows,
            'matrices':[('入力',image),('ラプラシアンの重み',KERNELS['laplacian']),('符号を残した出力',output)],
            'result':f"中央の合計={center['value']}", 'comparison':f"元の画像の中央={filtering(IMAGE,'laplacian')[1][1]}",
            'explanation':'負の値は失敗ではなく明暗変化の向きを含む。表示で絶対値や0〜255に変換する操作とは分ける。',
            'reset':'invert=Falseで再実行。'}


def lesson_features(threshold=1):
    mask = binary(IMAGE,threshold)
    result = features(mask)
    rows = [(r,c,mask[r][c],r*mask[r][c],c*mask[r][c]) for r in range(5) for c in range(5) if mask[r][c]]
    if not rows:rows=[('—','—',0,0,0)]
    return {'title':'領域の特徴：面積と重心','question':'1が一つもない場合、重心をどう扱うか',
            'input':f'しきい値{threshold}の二値マスク','columns':['行','列','1なら数える','行×値','列×値'],'rows':rows,
            'matrices':[('領域',mask)], 'result':result,
            'comparison':f'しきい値9なら{features(binary(IMAGE,9))}',
            'explanation':'面積は1の合計、重心は行の重み付き和÷面積と列の重み付き和÷面積。面積0なら重心はNone（未定義）。',
            'reset':'threshold=1で再実行。'}


def lesson_match(position=6):
    width = len(SCENE[0])-len(TEMPLATE[0])+1
    row,col = divmod(position,width)
    patch = window(SCENE,row,col,2,2)
    matrix(patch)
    ssd = match(SCENE,TEMPLATE,'ssd')
    zncc = match(SCENE,TEMPLATE,'zncc')
    rows = [(i,j,patch[i][j],TEMPLATE[i][j],patch[i][j]-TEMPLATE[i][j],(patch[i][j]-TEMPLATE[i][j])**2) for i in range(2) for j in range(2)]
    all_scores = [(r,c,value,zncc['scores'][r][c]) for r,line in enumerate(ssd['scores']) for c,value in enumerate(line)]
    return {'title':'テンプレート：位置ごとに比較した4画素とスコア','question':'一致する位置のSSDはいくつか',
            'input':f'開始位置[{row},{col}]、出力スコア表の同じ位置','columns':['窓内行','窓内列','画像','テンプレート','差','二乗差'],'rows':rows,
            'tables':[('全12位置の比較',['行','列','SSD（小さい方）','ZNCC（大きい方）'],all_scores)],
            'matrices':[('全体画像',SCENE),('選択中の窓',patch),('テンプレート',TEMPLATE),('SSDの位置対応',ssd['scores'])],
            'result':f"選択窓のSSD={score(patch,TEMPLATE)}、最良={ssd['best']}",
            'comparison':f"同じテンプレートに明るさ10を足すとSSD={score(tone(TEMPLATE,10),TEMPLATE)}、ZNCC={score(tone(TEMPLATE,10),TEMPLATE,'zncc')}",
            'explanation':'SSDは差の二乗和。ZNCCは平均を引き長さで割るため一様な明るさ変化には違う応答をする。定数窓では分母0となりNone。同点は全件表示し最初の位置を代表にする。',
            'reset':'position=6で再実行。位置は0〜11。'}

STUDY_THEMES = {'binary': lesson_binary, 'filter': lesson_filter, 'edge': lesson_edge, 'features': lesson_features, 'match': lesson_match}

def explain_lesson(theme='all'):
    """表示は丸めても、計算には元の値を使う。"""
    functions = STUDY_THEMES if theme == 'all' else {theme: STUDY_THEMES[theme]}
    for name, function in functions.items():
        report = function()
        print('\nテーマ:', report['title'])
        print('問い:', report['question'])
        print('入力:', report['input'])
        print(' | '.join(report['columns']))
        for row in report['rows']:
            print(' | '.join(str(value) for value in row))
        for title, columns, rows in report.get('tables', []):
            print(title, ' | '.join(columns))
            for row in rows:
                print(' | '.join(str(value) for value in row))
        print('結果:', report['result'])
        print('一つ変える:', report['comparison'])
        print('読み取り:', report['explanation'])
        print('戻す:', report['reset'])


def study_cli():
    parser = argparse.ArgumentParser(description='入力→途中計算→結果を読む')
    parser.add_argument('--explain', choices=['all', *STUDY_THEMES], required=True)
    args = parser.parse_args()
    explain_lesson(args.explain)

if __name__ == '__main__':
    import sys
    if '--explain' in sys.argv:
        study_cli()
    else:
        main()
