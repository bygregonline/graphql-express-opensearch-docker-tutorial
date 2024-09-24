
FROM python:3.10-slim
WORKDIR /app
RUN apt update -y
RUN apt upgrade -y
RUN apt install -y nano curl iputils-ping net-tools htop procps
COPY req.txt .
RUN pip install --no-cache-dir -r req.txt
COPY load.py .
COPY data.json .
RUN echo done  all
RUN touch /dev/null
COPY script.sh .
RUN chmod +x script.sh
# ENTRYPOINT ["tail", "-f", "/dev/null"]

