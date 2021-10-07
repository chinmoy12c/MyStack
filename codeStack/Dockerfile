FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        --no-install-recommends
RUN apt install wget
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
RUN install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
RUN sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
RUN rm -f packages.microsoft.gpg
RUN apt-get update 
RUN apt-get -y install libasound2
RUN apt-get -y install libatk1.0-0
RUN apt-get -y install libcairo2
RUN apt-get -y install libcups2
RUN apt-get -y install libexpat1
RUN apt-get -y install libfontconfig1
RUN apt-get -y install libfreetype6
RUN apt-get -y install libgtk2.0-0
RUN apt-get -y install libpango-1.0-0
RUN apt-get -y install libx11-xcb1
RUN apt-get -y install libxcomposite1
RUN apt-get -y install libxcursor1
RUN apt-get -y install libxdamage1
RUN apt-get -y install libxext6
RUN apt-get -y install libxfixes3
RUN apt-get -y install libxi6
RUN apt-get -y install libxrandr2
RUN apt-get -y install libxrender1
RUN apt-get -y install libxss1
RUN apt-get -y install libxtst6
RUN apt-get -y install libxshmfence-dev
RUN apt-get -y install openssh-client
RUN apt-get -y install git
RUN apt-get -y install code

# Program compilers
#gdb
RUN apt-get install -y gdb
# gcc and g++ build essentials
RUN apt-get install -y build-essential
# java
RUN apt-get install -y default-jre
RUN apt-get install -y default-jdk

RUN mkdir /root/codedata
RUN mkdir /root/mydata
CMD [ "/usr/bin/code","--user-data-dir=/root/codedata","--verbose","--no-sandbox"]