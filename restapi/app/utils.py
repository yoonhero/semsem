from flask import send_file
import base64
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from datetime import date
from io import BytesIO


# 22.11.9
def get_today():
    today = date.today()
    return today.strftime("%y.%m.%d")


def serve_pil_image(pil_img):
    img_io = BytesIO()
    pil_img.save(img_io, 'JPEG', quality=80)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')


def make_grid(imgs, rows, cols):
    assert len(imgs) == rows*cols

    w, h = imgs[0].size
    grid = Image.new('RGB', size=(cols*w, rows*h))

    for i, img in enumerate(imgs):
        grid.paste(img, box=(i % cols*w, i//cols*h))
    return grid


def resize_image_to_fit_frame(image, target_width):
    w, h = image.size

    new_height = int(target_width / w * h)

    new_size = (target_width, new_height)

    image = image.resize(new_size, resample=Image.ANTIALIAS)

    crop_area = (0, new_height/2-365/2, 618, new_height/2+365/2)

    image = image.crop(crop_area)

    return image


def drawText(image, info):
    pos, text, font, rgb_color = info

    I1 = ImageDraw.Draw(image)

    I1.text(pos,  text, font=font,  fill=rgb_color)

    return image


def make_image_frame(imgs, frame):
    text_pos = {
        "frame_black": ((618/2-30, 1600), (255, 255, 255)),
        "frame_blue": ((618/2-30, 1680), (255, 255, 255)),
        "frame_purple": ((618/2-30, 1650), (255, 255, 255)),
        "frame_white": ((618/2-30, 1680), (0, 0, 0)),
        "frame_green": ((618/2-30, 1680), (0, 0, 0)),
        "frame_red": ((618/2-30, 1680), (255, 255, 255)),
        "romela_frame": ((618/2-30, 1680), (0, 0, 0))
    }

    frames = ['./app/romela_frame.png', './app/frame_red.png', './app/frame_green.png',
              './app/frame_blue.png', './app/frame_purple.png', './app/frame_white.png', './app/frame_black.png', ]

    t_frame = frames[int(frame)]

    background = Image.open(t_frame)
    w, original_h = background.size
    # w, h = (618, 365)
    h = original_h / 4.7

    grid = Image.new("RGB", size=(w, original_h))

    for i, img in enumerate(imgs):
        resized_img = resize_image_to_fit_frame(img, w)
        grid.paste(resized_img, box=(0, int(i*h)))

    # if ai:
    #    grid = img2anime(grid)

    grid.paste(background, (0, 0), background)

    t_frame_key = t_frame.split(".")[1].split("/")[-1]

    # if t_frame_key == "romela_frame":
    #    return grid

    pos, rgb_color = text_pos.get(t_frame_key)
    myFont = ImageFont.truetype('./app/Woojin_Hyun.ttf', 30)
    t_text = get_today()

    result = drawText(grid, (pos, t_text, myFont, rgb_color))

    return result


def img_to_base64_str(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    img_str = "data:image/png;base64," + base64.b64encode(img_byte).decode()
    return img_str
