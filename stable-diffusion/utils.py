from PIL import Image
from regex import R
import torch
from torch import autocast
import zlib
import bz2

# Convert many images to one grid image
def makegrid(imgs, rows, cols):
    assert len(imgs) == rows*cols

    w, h = imgs[0].size
    grid = Image.new("RGB", size=(cols*w, rows*h))

    for i, img in enumerate(imgs):
        grid.paste(img, box=(i%cols*w, i//cols*h))
    
    return grid


def get_device():
    return "cuda" if torch.cuda.is_available() else "cpu"


def animalism(pipe, image_dir, prompt, strength, guidance_scale, device=get_device()):
    init_img = Image.open(image_dir)
    generator = torch.Generator(device=device)
    with autocast("cuda"):
        image = pipe(prompt=prompt, init_image=init_img, strength=strength, guidance_scale=guidance_scale, generator=generator).images[0]

    return image



def decompress(input_file, output_file):
    with bz2.open(input_file, 'rb') as f:
        indata = f.read()


    outdata = zlib.decompressobj().decompress(indata)

    outFile = open(output_file, "wb")

    outFile.write(outdata)

    outFile.close()