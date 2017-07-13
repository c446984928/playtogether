FROM node:6.10.3
RUN \
  apt-get update -y && \
  apt-get upgrade -y && \
  apt-get install \
    build-essential \
    curl \
    libffi-dev \
    libssl-dev \
    python-dev \
    python-pip -y \
    uuid \
    vim \
    git \
    && \
  curl https://phuslu.github.io/bashrc >/root/.bashrc

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3000

CMD node bin/www

