import sys, numpy as np
from PIL import Image
d, dest = sys.argv[1], sys.argv[2]
ordem=['05','06','07','08','17','18','19','20','08b','20b']  # 8 de caminhada + passo final + pose parada
W,H,FIG=272,476,456
quadros=[]
for n in ordem:
    im=Image.open(f'{d}/{n}.png')
    s=FIG/im.height
    im=im.resize((max(1,round(im.width*s)),FIG),Image.LANCZOS)
    a=np.asarray(im)[:,:,3]
    top=a[:int(FIG*0.14)]  # chapéu/cabeça: alinha o eixo do corpo
    xs=np.where(top>128)[1]; cx=xs.mean()
    c=Image.new('RGBA',(W,H),(0,0,0,0))
    c.alpha_composite(im,(int(round(W/2-cx)),H-FIG-6)) if im.width<=W else None
    if im.width>W:
        x=int(round(W/2-cx)); c.paste(im,(x,H-FIG-6),im)
    quadros.append(c)
for nome,alt in [('doutor-andando',H),('doutor-andando-pequeno',300)]:
    w=round(W*alt/H)
    tira=Image.new('RGBA',(w*len(quadros),alt),(0,0,0,0))
    for i,q in enumerate(quadros): tira.paste(q.resize((w,alt),Image.LANCZOS),(i*w,0))
    tira.save(f'{dest}/{nome}.webp',quality=82,method=6)
    print(nome,tira.size)
