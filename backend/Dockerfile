# 使用官方 Python 运行时作为父镜像
FROM docker.m.daocloud.io/python:3.9-slim

# 设置工作目录
WORKDIR /app

# 将当前目录内容复制到容器的 /app 中
COPY . /app

# 安装 requirements.txt 中指定的任何所需包
RUN pip install -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple --no-cache-dir -r requirements.txt

# 使端口 5000 在容器外可用
EXPOSE 5000

# 定义环境变量
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# 运行 app.py
CMD ["flask", "run"]