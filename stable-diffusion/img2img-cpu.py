import torch 
from PIL import Image
import numpy as np
from io import BytesIO
from diffusers import StableDiffusionImg2ImgPipeline
import random
import matplotlib.pyplot as plt

device = "cpu"

pipe = StableDiffusionImg2ImgPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", use_auth_token=True)
pipe.to(device)


def resize(value, img):
    img = Image.open(img)
    img = img.resize((value, value), Image.Resampling.LANCZOS)
    return img


def infer(source_img, prompt, guide, steps, seed, Strength):
    generator = torch.Generator(device).manual_seed(seed)

    source_img = resize(512, source_img)
    source_img.save("source_img.png")

    image_list = pipe([prompt], init_image=source_img, strength=Strength, guidance_scale=guide, num_inference=steps)

    images = image_list.images

    return images


if __name__ == '__main__':
    init_img = "./test.JPG"
    prompt = "photorealistic Cat portrait, detailed eyes, sweet face, perfect face, beautiful, by Fragnard"

    guide = 7.5
    steps = 25
    seed = random.randint(2, 1024)
    Strength = 0.75

    results = infer(init_img, prompt, guide, steps, seed, Strength)

    plt.imshow(results[0])

