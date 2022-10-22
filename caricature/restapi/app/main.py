from flask import Flask, request, jsonify, send_file
from io import BytesIO
from app.torch_utils import img2anime
from PIL import Image

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'png', "jpg", "jpeg"}


def allowed_file(filename):
    return '.' in filename and filename.split(".")[-1].lower() in ALLOWED_EXTENSIONS


def serve_pil_image(pil_img):
    img_io = BytesIO()
    pil_img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')


@app.route("/predict", methods=["POST"])
def predict():
    if request.method == 'POST':
        file = request.files.get("file")

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

            return serve_pil_image(anime_img)

        except:
            return jsonify({"error":"error during processing"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5001', debug=True)