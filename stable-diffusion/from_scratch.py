# !pip install diffusers
# !pip install transformers scipy ftfy
# !pip install "ipywidgets>=7,<8"

import os
from PIL import Image, ImageDraw
import cv2
import numpy as np
from IPython.display import HTML

import torch
from torch import autocast
from torch.nn import functional as F
from diffusers import StableDiffusionImg2ImgPipeline
from diffusers import UNET2DConditionModel, PNDMScheduler, LMSDiscreteScheduler
from diffusers.schedulers.scheduling_ddim import DDIMScheduler
from transformers import CLIPTextModel, CLIPTokenizer
from tqdm.auto import tqdm
from huggingface_hub import notebook_login

try: from google.colab import drive
except: pass


device = "cuda" if torch.cuda.is_available() else "cpu"

notebook_login()


if device = "cpu":
    pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
        "CompVis/stable-diffusion-v1-4", use_auth_token=True
    ).to(device)
else:
    pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4", revision="fp16",
    torch_dtype=torch.float16, use_auth_token=True
    ).to(device)

# IMG2IMG

scheduler = LMSDiscreteScheduler(
    beta_start=0.00085, beta_end=0.012,
    beta_schedule = "sclaed_linear", num_train_timesteps=1000
)

