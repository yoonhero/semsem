import torch 
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from diffusers import StableDiffusionImg2ImgPipeline
from huggingface_hub import hf_hub_download
import gensim
from gensim.models.word2vec import Word2Vec
import gensim.downloader
import re
import urllib.request
import zipfile
from lxml import etree
from nltk.tokenize import word_tokenize, sent_tokenize

# original_model = hf_hub_download(
#  repo_id="CompVis/stable-diffusion-v-1-4-original",
#  filename="sd-v1-4.ckpt",
#  use_auth_token=True
# )

# d = 50, 100, 200, 300
# TODO: T for token size parameter 
def get_pretrained_embedding_weights(T, d, download):
    if download:
        # 데이터 다운로드
        urllib.request.urlretrieve("https://raw.githubusercontent.com/ukairia777/tensorflow-nlp-tutorial/main/09.%20Word%20Embedding/dataset/ted_en-20160408.xml", filename="ted_en-20160408.xml")

        targetXML = open('ted_en-20160408.xml', 'r', encoding='UTF8')
        target_text = etree.parse(targetXML)

        # xml 파일로부터 <content>와 </content> 사이의 내용만 가져온다.
        parse_text = '\n'.join(target_text.xpath('//content/text()'))

        # 정규 표현식의 sub 모듈을 통해 content 중간에 등장하는 (Audio), (Laughter) 등의 배경음 부분을 제거.
        # 해당 코드는 괄호로 구성된 내용을 제거.
        content_text = re.sub(r'\([^)]*\)', '', parse_text)

        # 입력 코퍼스에 대해서 NLTK를 이용하여 문장 토큰화를 수행.
        sent_text = sent_tokenize(content_text)

        # 각 문장에 대해서 구두점을 제거하고, 대문자를 소문자로 변환.
        normalized_text = []
        for string in sent_text:
            tokens = re.sub(r"[^a-z0-9]+", " ", string.lower())
            normalized_text.append(tokens)

        # 각 문장에 대해서 NLTK를 이용하여 단어 토큰화를 수행.
        result = [word_tokenize(sentence) for sentence in normalized_text]

        model = Word2Vec(sentences = result, size = d, window = 5, min_count = 5, workers = 4, sg = 0)
        model.save("./word2vec_pretrained.model")

    else:
        model = gensim.models.Word2Vec.load('./word2vec_pretrained.model')
    
    weights = torch.FloatTensor(model.wv.vectors)
    return weights


## LOSS FUNCTION
loss = nn.MSELoss()

# 1. Text Embdding optimization
class TextEmbedding(nn.Module):
    # T is the number of tokens in the given target text
    # d is the token embedding dimension
    def __init__(self, T, d=100):
        super().__init__()
        
        weights = get_pretrained_embedding_weights(T, d, True)
        self.embedding_layer = nn.Embedding.from_pretrained(weights, freeze=False)

    def forward(self, x):
        return self.embedding_layer(x)
        

text_embeding = TextEmbedding(10000, 100)

def text_embedding_optimization(prompt):
    pred = text_embedding(prompt)
    y = "" # TODO:w hat"s after like?

    loss_ = loss()



# 2. Model Fine-tuning
# 3. Text embedding interpolation






if __name__ == '__main__':
    tokens = 10000
    dimension = 200
    text_embedding = TextEmbedding(tokens, dimension)

    sen = "you need to know how to code"
    result = text_embedding(sen)

    print(f"{sen} -> {result.shape}")