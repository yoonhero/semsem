import base64
import json
import os
from flask import Flask, request, jsonify, send_file
from io import BytesIO
from PIL import Image
from flask_cors import CORS, cross_origin
import time

from torch_utils import img2anime
from imgur_uploader import Uploader


app = Flask(__name__)
cors = CORS(app, resources={r'*': {'origins': '*'}})
# app.config['CORS_HEADERS'] = 'Content-Type'
# app.config["Access-Control-Allow-Origin"] = "*"

ALLOWED_EXTENSIONS = {'png', "jpg", "jpeg"}

# client = authenticate()

imgur_uploader = Uploader()


def allowed_file(filename):
    return '.' in filename and filename.split(".")[-1].lower() in ALLOWED_EXTENSIONS


def serve_pil_image(pil_img):
    img_io = BytesIO()
    pil_img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')

def image_grid(imgs, rows, cols):
    assert len(imgs) == rows*cols

    w, h = imgs[0].size
    grid = Image.new('RGB', size=(cols*w, rows*h))
    grid_w, grid_h = grid.size
    
    for i, img in enumerate(imgs):
        grid.paste(img, box=(i%cols*w, i//cols*h))
    return grid


def resize_image_fit_frame(image, target_width):
    w, h = image.size

    new_height = int(target_width / w * h)

    new_size = (target_width, new_height)

    image = image.resize(new_size, resample=Image.Resampling.NEAREST)

    crop_area = (0, new_height/2-365/2,618, new_height/2+365/2)

    image = image.crop(crop_area)

    return image


def make_image_frame(imgs, frame):

    frames = ["./romela_frame.png", "./frame.png"]
    background = Image.open(frames[int(frame)])
    w, original_h = background.size
    # w, h = (618, 365)
    h = original_h / 4.7

    grid = Image.new("RGB", size=(w, original_h))

    for i, img in enumerate(imgs):  
        resized_img = resize_image_fit_frame(img, w)
        grid.paste(resized_img, box=(0, int(i*h)))

    
    grid.paste(background, (0, 0), background)

    return grid


def img_to_base64_str(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    img_str = "data:image/png;base64," + base64.b64encode(img_byte).decode()
    return img_str


@app.route("/api/predict", methods=["POST"])
@cross_origin()
def predict_for_web():
    params = request.get_json()

    images = params["images"]
    frame = params["frame"]

    results = []

    for image in images:
        image = image[image.find(",") + 1 :]
        dec = base64.b64decode(image + "===")
        image = Image.open(BytesIO(dec))

        print("Loading success")

        anime_img = img2anime(image)

        print("processing success")

        results.append(anime_img)   


    result_img = make_image_frame(results, frame)

    timestamp = time.time()
    file_name = f"{int(timestamp*100)}.png"

    PATH = "./results"
    if not os.path.exists(PATH):
        os.makedirs(PATH)

    filepath = os.path.join(PATH,file_name)


    result_img.save(filepath)

    uploaded_link = imgur_uploader.upload(filepath,  f"맬라네컷 {int(timestamp*100)}")    
    qr_img = imgur_uploader.make_qr(uploaded_link)

    bytes_img = img_to_base64_str(result_img)
    bytes_qr = img_to_base64_str(qr_img)


    result = {"output": bytes_img, "qr": bytes_qr}


    return jsonify({
        "statusCode": 200,
        "body": result,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    })


@app.route("/predict", methods=["POST"])
def predict():
    if request.method == 'POST':
        files = request.files.getlist("file")
        results = []

        for file in files:
            if file is None or file.filename == "":
                return jsonify({"error": "no file"})
            if not allowed_file(file.filename):
                return jsonify({"error": "format not supported"})

            try: 
                img_bytes = file.read()

                image = Image.open(BytesIO(img_bytes))

                print("Loading success")

                anime_img = img2anime(image)

                print("processing success")

                results.append(anime_img)

            except:
                return jsonify({"error":"error during processing"})


        # result_img = image_grid(results, 2, 2)

        result_img = image_frame(results)
        
        return serve_pil_image(result_img)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=True)