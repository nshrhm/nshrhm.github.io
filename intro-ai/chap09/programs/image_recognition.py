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
    if not isinstance(a,list) or not 1 <= len(a) <= 16 or not isinstance(a[0],list) or not 1 <= len(a[0]) <= 16:
        raise ValueError('行列は1〜16行・列の二重リストです')
    w=len(a[0])
    for row in a:
        if not isinstance(row,list) or len(row)!=w: raise ValueError('各行の列数をそろえてください')
        for x in row: finite(x)
    return len(a),w

def tone(image, offset=0):
    matrix(image);finite(offset,-255,255)
    for row in image:
        for x in row: finite(x,0,255)
    return [[min(255,max(0,x+offset)) for x in row] for row in image]

def binary(image, threshold=1):
    matrix(image);finite(threshold,0,255)
    return [[int(x>threshold) for x in row] for row in image]

def window(image,row,col,h,w):
    return [line[col:col+w] for line in image[row:row+h]]

def filtering(image, method='mean'):
    h,w=matrix(image)
    if h<3 or w<3: raise ValueError('3×3以上の画像を指定してください')
    if method not in ['mean','median','range',*KERNELS]: raise ValueError('未知のフィルタです')
    out=[]
    for r in range(h-2):
        line=[]
        for c in range(w-2):
            values=[x for row in window(image,r,c,3,3) for x in row]
            if method=='mean': value=sum(values)/9
            elif method=='median': value=sorted(values)[4]
            elif method=='range': value=max(values)-min(values)
            else: value=sum(image[r+i][c+j]*KERNELS[method][i][j] for i in range(3) for j in range(3))
            line.append(value)
        out.append(line)
    return out

def features(mask):
    h,w=matrix(mask)
    if any(x not in (0,1) for row in mask for x in row): raise ValueError('二値マスクの値は0か1です')
    area=sum(sum(row) for row in mask)
    return {'area':area,'centroid':None if area==0 else [sum(r*mask[r][c] for r in range(h) for c in range(w))/area,sum(c*mask[r][c] for r in range(h) for c in range(w))/area],
            'rows':[sum(row) for row in mask],'columns':[sum(mask[r][c] for r in range(h)) for c in range(w)]}

def pool(image):
    h,w=matrix(image)
    if h%2 or w%2: raise ValueError('2×2プーリングでは行・列を偶数にしてください')
    return [[max(image[r+i][c+j] for i in range(2) for j in range(2)) for c in range(0,w,2)] for r in range(0,h,2)]

def score(patch, template, method='ssd'):
    if matrix(patch)!=matrix(template): raise ValueError('同じ形のパッチとテンプレートを指定してください')
    a=[x for row in patch for x in row];b=[x for row in template for x in row]
    if method=='ssd': return sum((x-y)**2 for x,y in zip(a,b))
    if method!='zncc': raise ValueError('評価方法はssdかznccです')
    ma=sum(a)/len(a);mb=sum(b)/len(b)
    a=[x-ma for x in a];b=[x-mb for x in b]
    denominator=math.sqrt(sum(x*x for x in a)*sum(x*x for x in b))
    if denominator==0: return None
    return sum(x*y for x,y in zip(a,b))/denominator

def match(image, template, method='ssd'):
    h,w=matrix(image);th,tw=matrix(template)
    if th>h or tw>w: raise ValueError('テンプレートは画像以下の大きさにしてください')
    if method not in ('ssd','zncc'): raise ValueError('評価方法はssdかznccです')
    scores=[[score(window(image,r,c,th,tw),template,method) for c in range(w-tw+1)] for r in range(h-th+1)]
    candidates=[(s,r,c) for r,row in enumerate(scores) for c,s in enumerate(row) if s is not None]
    if not candidates: return {'scores':scores,'best':None,'ties':[]}
    value=(min if method=='ssd' else max)(s for s,r,c in candidates)
    ties=[[r,c] for s,r,c in candidates if abs(s-value)<=1e-12]
    return {'scores':scores,'best':{'row':ties[0][0],'col':ties[0][1],'score':value},'ties':ties}

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

if __name__=='__main__': main()
