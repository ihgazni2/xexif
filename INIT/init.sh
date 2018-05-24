git init
if [$# == 2];then
    username = $1
    password = $2
    echo https://${username}:${password}@github.com > $HOME/.git-credentials
fi
git config --global credential.helper store
eval `ssh-agent`
ssh-add
git remote add origin git@github.com:ihgazni2/xexif.git
git pull origin master
git add .
git commit -m "first commit"
git push origin master

