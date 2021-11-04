while getopts c:v: flag
do
    case "${flag}" in
        c) container=${OPTARG};;
        v) volume=${OPTARG};;
    esac
done

docker run --restart=always --volume=$volume:/home/student --net=mystack $container