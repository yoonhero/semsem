# 멜라네컷 with AI

인생네컷 프로그램 made by Yoonhero.

![web](https://github.com/yoonhero/semsem/blob/master/docs/main_web.png?raw=true)

## Introduction

이 프로그램은 로맬라 동아리의 프로젝트 중 일부입니다. 라즈베리파이를 통한 인생네컷 부스를 제작하여 학교에 전시할 예정이며 향후 업그레이드를 통해서 앱으로 출시할 계획입니다.

서버는 파이썬의 Flask로 구축하였습니다. 인생네컷의 모드 중 인공지능 캐리커쳐 모드를 구축하기 위해서 torch 모듈로 모델을 로딩하여 이미지를 처리해주는 API를 제작했습니다.

웹은 NextJS로 구축하였습니다. react-webcam, tailwindcss 와 같은 라이브러리를 사용하여 웹사이트를 제작하였습니다.

## Installation

```bash
git clone https://github.com/yoonhero/semsem
```

<strong>Web</strong>

```bash
cd /YOUR DIRECTORY TO THIS PROJECT FOLDER/semsem
```

```bash
npm run dev
```

or

```bash
npm run build => npm run start
```

<strong>Python API</strong>

```bash
cd /YOUR DIRECTORY TO THIS PROJECT FOLDER/restapi
```

```bash
gunicorn --bind 0.0.0.0:4000 wsgi:app
```

## License

GNU 3.0
