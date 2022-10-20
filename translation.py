from googletrans import Translator

class Translation():
    def __init__(self):
        self.translator = Translator()

    def translate(self, text):
        return self.translator.translate(text, dest="en").text
        

if __name__ == "__main__":
    trans = Translation()

    print(trans.translate("그 남자는 바보입니다.")) # The man is stupid.