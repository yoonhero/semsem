from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import urllib.request
import requests
import os


class Crawling:
    def __init__(self, category, folder, max):
        self.category = category
        self.driver = webdriver.Chrome(
            "/Users/yoonseonghyeon/Desktop/programming/python/python_AI/semsem/chromedriver")

        self.SCROLL_PAUSE_TIME = 1
        self.folderName = "./data/" + folder
        self.IMAGE_PAUSE_TIME = 0.4
        self.max_images = max
        self.count = 0
        self.start()

    def start(self):
        self.driver.get(
            "https://www.google.co.kr/imghp?hl=ko&tab=wi&authuser=0&ogbl")
        elem = self.driver.find_element("name", 'q')
        elem.send_keys(self.category)
        elem.send_keys(Keys.RETURN)

        self.scrollToBottom()
        self.imageCrawling()

    def scrollToBottom(self):
        self.last_height = self.driver.execute_script(
            "return document.body.scrollHeight")

        while True:
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);")

            time.sleep(self.SCROLL_PAUSE_TIME)

            self.new_height = self.driver.execute_script(
                "return document.body.scrollHeight")

            if self.new_height == self.last_height:
                # try:
                #     self.driver.find_element("css", ".mye4qd").click()
                # except:
                #     break
                break
            self.last_height = self.new_height

    def imageCrawling(self):
        self.images = self.driver.find_elements(By.CSS_SELECTOR, (".rg_i.Q4LuWd"))

        self.images = self.images[:self.max_images]

        for image in self.images:
            try:
                image.click()
                time.sleep(self.IMAGE_PAUSE_TIME)

                file_name = str(self.count) + ".png"

                completeFileName = os.path.join(self.folderName, file_name)
                print(completeFileName)

                imgUrl = self.driver.find_element(By.XPATH,
                    '//*[@id="Sva75c"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[3]/div/a/img').get_attribute("src")
                
                print("SRC")


                f = open(completeFileName, "wb")
                print("OPEN FILE")

                f.write(requests.get(imgUrl).content)
                print("WRITE")


                f.close()

                self.count += 1

            except:
                pass

        self.driver.close()


crawler = Crawling("Dalí painting", "dall", 30)
