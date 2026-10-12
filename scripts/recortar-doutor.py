# Recorte do Doutor: reconstrói o xadrez "assado" de cada célula (período e fase) e remove
# só os pixels que coincidem com ele — assim brilhos cinzentos do chapéu/capa são preservados.
import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(float)
C=[0,256,515,803,1098]; R=[0,152,310,459,610,768]
cells=[]
for r in range(5):
    for c in range(4): cells.append((C[c],R[r],(C+[1408])[c+1],R[r+1]))
    if r==0: cells.append((1098,0,1408,152))
    if r==1: cells.append((1098,152,1408,384))
cells.append((1098,384,1408,768))
names=['01','02','03','04','04b','05','06','07','08','08b','09','10','11','12','13','14','15','16','17','18','19','20','20b']

def onda(n, P, f):
    return np.where(((np.arange(n)-f)/P)%2<1,1.0,-1.0)

def ajustar(perfis):
    # perfis: lista de vetores (média 0); acha período/fase da onda quadrada
    melhor=(-1,None)
    n=len(perfis[0])
    for P in np.arange(11.6,11.86,0.01):
        for f in np.arange(0,2*P,0.25):
            w=onda(n,P,f)
            s=sum(abs((p*w).sum()) for p in perfis)
            if s>melhor[0]: melhor=(s,(P,f))
    return melhor[1]

for nome,(x0,y0,x1,y1) in zip(names,cells):
    p=im[y0+3:y1-3,x0+3:x1-3]; h,w,_=p.shape
    L=p.mean(2); sat=p.max(2)-p.min(2)
    borda=np.zeros((h,w),bool); borda[-12:]=True; borda[:,-10:]=True; borda[:,:6]=True
    vb=L[borda&(sat<12)]
    claro=np.median(vb[vb>150]); escuro=np.median(vb[vb<=150])
    cand=(sat<16)&(L>escuro-22)&(L<claro+30)
    lab,_=nd.label(cand)
    edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(edge))
    # vãos fechados (entre braço, cajado e corpo): só se parecem xadrez (os dois tons presentes)
    for i in range(1,lab.max()+1):
        if i in edge: continue
        v=L[lab==i]
        if v.size<20: continue
        pc=(np.abs(v-claro)<12).mean(); pe=(np.abs(v-escuro)<12).mean()
        if (pc+pe>0.55 and (min(pc,pe)>0.12 or v.size<90)) or v.mean()>112: bg|=lab==i
    # sombra cinza assada embaixo dos pés
    base=np.zeros((h,w),bool); base[int(h*0.9):]=True
    bg|=base&(sat<14)&(L>60)&nd.binary_dilation(bg,iterations=6)
    fg=nd.binary_opening(~bg,iterations=1)
    lab2,k=nd.label(fg)
    sizes=nd.sum(fg,lab2,range(1,k+1))
    big=np.argmax(sizes)+1
    keep=lab2==big
    vizinho=nd.binary_dilation(keep,iterations=7)
    for i,sz in enumerate(sizes,1):
        if i!=big and sz>8 and (vizinho&(lab2==i)).any(): keep|=lab2==i
    buracos=nd.binary_fill_holes(keep)&~keep
    lb,nb=nd.label(buracos)
    for i in range(1,nb+1):
        rr=lb==i
        if rr.sum()<10: keep|=rr
    alfa=nd.gaussian_filter(keep.astype(float),0.7)
    alfa=np.clip((alfa-0.2)/0.6,0,1)
    interior=nd.binary_erosion(keep,iterations=1)
    _,(iy,ix)=nd.distance_transform_edt(~interior,return_indices=True)
    rgb=p.copy(); b=alfa<0.999
    rgb[b]=p[iy[b],ix[b]]
    rgba=Image.fromarray(rgb.astype('uint8')).convert('RGBA'); rgba.putalpha(Image.fromarray((alfa*255).astype('uint8')))
    ys,xs=np.where(alfa>0.02)
    rgba.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1)).save(f'{out}/{nome}.png')
    print(nome,int(claro),int(escuro))
