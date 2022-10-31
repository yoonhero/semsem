import torch 



model2 = torch.hub.load(
    "AK391/animegan2-pytorch:main",
    "generator",
    pretrained=True,
    device="cpu",
    progress=True
)


face2paint = torch.hub.load(
    'AK391/animegan2-pytorch:main', 'face2paint', 
    size=512, device="cpu",side_by_side=False
)


def img2anime(img):
    out = face2paint(model2, img)
    return out

