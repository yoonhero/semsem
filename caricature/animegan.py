from PIL import Image
import torch
import gradio as gr




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


def inference(img):
    out = face2paint(model2, img)
    return out

title = "Create Animation Face"
description = "애니매이션 테스트"
article = """
<p style='text-align: center'>
<a href='https://github.com/bryandlee/animegan2-pytorch' target='_blank'>Github Repo Pytorch</a>
</p>
"""


app = gr.Interface(inference, gr.inputs.Image(type="pil"), gr.outputs.Image(type="pil"),title=title,description=description,article=article,allow_flagging=False,allow_screenshot=True)

app.launch()