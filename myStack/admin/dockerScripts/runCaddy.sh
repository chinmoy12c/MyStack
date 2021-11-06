#!/bin/bash

while getopts u:k:v:p:a: flag
do
    case "${flag}" in
        u) username=${OPTARG};;
        k) passwd=${OPTARG};;
        v) volume=${OPTARG};;
        p) port=${OPTARG};;
        a) attachTo=${OPTARG};;
    esac
done

docker run --detach --restart=always --volume=$volume:/home/student --net=mystack --env=APP_USERNAME=$username --env=APP_PASSWORD_HASH=$passwd --env=ATTACH_TO=$attachTo --publish=$port:8080 caddy
