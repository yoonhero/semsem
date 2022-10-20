import matplotlib.pyplot as plt
from PIL import Image
import dlib

# !pip install dlib

class FaceDetector():
    def __init__(self):
        # LOAD MODEL
        self.detector = dlib.get_frontal_face_detector()

    def crop_image(self, filepath, detected_faces, crop_width):

        assert detected_faces != None, "No detected face in the image."

        face_rect = detected_faces[0]
        width = face_rect.right() - face_rect.left()
        height = face_rect.bottom() - face_rect.top()
        
        assert width > crop_width and height > crop_width, "Image is small to crop"

        image_to_crop = Image.open(filepath)
        
        crop_area = (face_rect.left(), face_rect.top(), face_rect.right(), face_rect.bottom())
        cropped_image = image_to_crop.crop(crop_area)
        crop_size = (crop_width, crop_width)
        cropped_image.thumbnail(crop_size)

        return cropped_image

    def predict(self, filepath, crop_width=108):
        init_img = plt.imread(filepath)

        detected_faces = self.detector(init_img, 1)

        cropped_image = self.crop_image(filepath, detected_faces, crop_width)

        return cropped_image

        

if __name__ == "__main__":
    face_detector = FaceDetector()

    import glob
    
    files = glob.glob("./test/*.jpeg")

    print(files)

    for i, file in enumerate(files):
        face = face_detector.predict(file, 54)

        face.save(f"./test_result/result_{i}.jpg", "JPEG")


        