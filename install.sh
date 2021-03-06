apt-get install docker.io
apt-get install mysql-server
mysql -u chinmoy -p mystack < file.sql
docker build -t tomstack ./webStack/tomcat/
docker build -t caddypassgen ./caddy/passwordGenerator/
docker build -t caddy ./caddy/caddyConnector/
docker run -it --detach --name=caddyPassGen caddypassgen