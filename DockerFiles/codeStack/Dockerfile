FROM golang:1.14-buster AS easy-novnc-build
WORKDIR /src
RUN go mod init build && \
    go get github.com/geek1011/easy-novnc@v1.1.0 && \
    go build -o /bin/easy-novnc github.com/geek1011/easy-novnc

FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openbox tigervnc-standalone-server supervisor gosu && \
    rm -rf /var/lib/apt/lists && \
    mkdir -p /usr/share/desktop-directories

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends lxterminal nano wget openssh-client rsync ca-certificates xdg-utils htop tar xzip gzip \
    bzip2 zip unzip wget sudo nautilus && \
    rm -rf /var/lib/apt/lists

# java
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends default-jre default-jdk && \
    rm -rf /var/lib/apt/lists

# gdb, C, C++
RUN apt-get update -y && \
    apt-get install -y gdb build-essential && \
    rm -rf /var/lib/apt/lists

RUN apt-get update && apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        --no-install-recommends
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor  | apt-key add -
RUN echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list
RUN apt-get update && apt-get -y install \
        code git \
        libasound2 \
        libatk1.0-0 \
        libcairo2 \
        libcups2 \
        libexpat1 \
        libfontconfig1 \
        libfreetype6 \
        libgtk2.0-0 \
        libpango-1.0-0 \
        libx11-xcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        libxshmfence-dev\
        openssh-client \
        --no-install-recommends \
        && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1000 student && \
    useradd --home-dir /home/student/ --shell /bin/bash --uid 1000 --gid 1000 student && \
    mkdir /home/student
VOLUME /home/student/studentData

RUN chown -R student:student /home/student/ /dev/stdout

RUN echo -n "student\nstudent" | passwd student
RUN usermod -aG sudo student

RUN apt-get -y update && \
    apt-get install -y tint2 && \
    rm -rf /var/lib/apt/lists

COPY --from=easy-novnc-build /bin/easy-novnc /usr/local/bin/
COPY menu.xml /var/lib/openbox/debian-menu.xml
COPY supervisord.conf /etc/
EXPOSE 6000

CMD ["sh", "-c", "chown student:student /home/student/studentData /dev/stdout && exec gosu student supervisord"]
