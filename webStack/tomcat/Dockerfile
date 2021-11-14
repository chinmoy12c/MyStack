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
    bzip2 zip unzip wget sudo gedit nautilus libcurl3-gnutls libcurl3-nss libcurl4 fonts-liberation && \
    rm -rf /var/lib/apt/lists

# java
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends default-jre default-jdk && \
    rm -rf /var/lib/apt/lists

RUN groupadd --gid 1000 student && \
    useradd --home-dir /home/student/ --shell /bin/bash --uid 1000 --gid 1000 student && \
    mkdir /home/student
VOLUME /home/student/studentData

# sql
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends mysql-server && \
    rm -rf /var/lib/apt/lists

# tomat
RUN wget -O tomcatSetup.zip https://dlcdn.apache.org/tomcat/tomcat-9/v9.0.54/bin/apache-tomcat-9.0.54.zip
RUN unzip tomcatSetup.zip
RUN mv apache* /home/student/tomcat
RUN rm tomcatSetup.zip
RUN chmod +x /home/student/tomcat/bin/catalina.sh

RUN chown -R student:student /home/student/ /dev/stdout

# Google chrome
RUN wget -O google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt update && apt install -y libgbm1
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb

RUN echo -n "student\nstudent" | passwd student
RUN usermod -aG sudo student

COPY --from=easy-novnc-build /bin/easy-novnc /usr/local/bin/
COPY menu.xml /var/lib/openbox/debian-menu.xml
COPY supervisord.conf /etc/
EXPOSE 6000

CMD ["sh", "-c", "chown student:student /home/student/studentData /dev/stdout && exec gosu student supervisord"]
