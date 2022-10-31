from flask import Flask, request, jsonify, send_file
from io import BytesIO
from torch_utils import img2anime
from PIL import Image
import smtplib

app = Flask(__name__)

ALLOWED_EXTENSIONS = {'png', "jpg", "jpeg"}


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


def resize_image_fit_frame(image):
    w, h = image.size

    target_width = 618
    new_height = int(target_width / w * h)

    new_size = (target_width, new_height)

    image = image.resize(new_size, resample=Image.Resampling.NEAREST)

    crop_area = (0, new_height/2-365/2,618, new_height/2+365/2)

    image = image.crop(crop_area)

    return image


def image_frame(imgs):
    w, h = (618, 365)

    grid = Image.new("RGB", size=(w, 1722))

    for i, img in enumerate(imgs):  
        resized_img = resize_image_fit_frame(img)
        grid.paste(resized_img, box=(0, i*h))

    background = Image.open("frame.png")

    grid.paste(background, (0, 0), background)

    return grid
    

def sendMail(me, you, msg):
    smtp = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    smtp.login(me, 'your password')
    msg = MIMEText(msg)
    msg['Subject'] = 'TEST'
    smtp.sendmail(me, you, msg.as_string())
    smtp.quit()


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
    app.run(host='0.0.0.0', port='5001', debug=True)