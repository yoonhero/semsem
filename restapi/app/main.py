import base64
import os
from flask import Flask, request, jsonify, send_file
from io import BytesIO
from PIL import Image
from flask_cors import CORS, cross_origin
import time

from torch_utils import img2anime
from imgur_uploader import Uploader
from utils import serve_pil_image, make_image_frame, img_to_base64_str


app = Flask(__name__)
cors = CORS(app, resources={r'*': {'origins': '*'}})

ALLOWED_EXTENSIONS = {'png', "jpg", "jpeg"}

imgur_uploader = Uploader()


def allowed_file(filename):
    return '.' in filename and filename.split(".")[-1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/predict", methods=["POST"])
@cross_origin()
def predict_for_web():
    params = request.get_json()

    images = params["images"]
    frame = params["frame"]

    results = []

    # TODO Allowed File

    for image in images:
        try:
            image = image[image.find(",") + 1 :]
            dec = base64.b64decode(image + "===")
            image = Image.open(BytesIO(dec))

            print("Loading success")

            anime_img = img2anime(image)

            print("processing success")

            results.append(anime_img)   

        except: return jsonify({"error": "Error when reading Image."})


    result_img = make_image_frame(results, frame)

    timestamp = time.time()
    file_name = f"{int(timestamp*100)}.png"

    PATH = "./results"
    if not os.path.exists(PATH):
        os.makedirs(PATH)

    filepath = os.path.join(PATH,file_name)


    result_img.save(filepath)

    uploaded_link = imgur_uploader.upload(filepath,  f"맬라네컷 {int(timestamp*100)}")  
    with open("links.txt", "a") as f:
        f.write(f'{uploaded_link}\n')

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

        result_img = make_image_frame(results)
        
        return serve_pil_image(result_img)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='4000', debug=True)