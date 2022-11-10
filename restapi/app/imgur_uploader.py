from pyimgur import Imgur
import qrcode


class Uploader():
	_client_id = "b6a9ced3148a1b3"
	def __init__(self):
		self.im = Imgur(Uploader._client_id)

	def upload(self, path, title):
		uploaded_image = self.im.upload_image(path=path, title=title)

		return uploaded_image.link

	def delete(self, links):
		for link in links: 
			self.im.delete(link)

	def make_qr(self, link):
		qr = qrcode.QRCode(
				version=1,
				box_size=10,
				border=5)
		qr.add_data(link)
		qr.make(fit=True)

		qr_code_img = qr.make_image(fill='black', back_color='white')

		return qr_code_img
