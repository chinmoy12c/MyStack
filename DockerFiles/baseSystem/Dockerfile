FROM golang:1.14-buster AS easy-novnc-build
WORKDIR /src
RUN go mod init build && \
    go get github.com/geek1011/easy-novnc@v1.1.0 && \
    go build -o /bin/easy-novnc github.com/geek1011/easy-novnc

FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openbox tigervnc-standalone-server supervisor gosu tint2 && \
    rm -rf /var/lib/apt/lists && \
    mkdir -p /usr/share/desktop-directories

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends lxterminal nano wget openssh-client rsync ca-certificates xdg-utils htop tar xzip gzip \
    bzip2 zip unzip wget sudo gedit nautilus libcurl3-gnutls libcurl3-nss libcurl4 fonts-liberation tint2 libgbm1 \
    libasound2 libu2f-udev curl apt-transport-https gnupg && \
    rm -rf /var/lib/apt/lists

RUN groupadd --gid 1000 student && \
    useradd --home-dir /home/student/ --shell /bin/bash --uid 1000 --gid 1000 student && \
    mkdir /home/student
VOLUME /home/student/studentData

# Google chrome
RUN wget -O google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get -y update && \
    apt-get install -y libasound2 libu2f-udev && \
    rm -rf /var/lib/apt/lists
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb

# Git
RUN apt-get -y update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists

RUN echo -n "student\nstudent" | passwd student
RUN usermod -aG sudo student
