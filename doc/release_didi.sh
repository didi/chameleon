GIT_SITE="git@github.com"
TEAM_NAME="didi"
PROJECT_NAME="chameleon"

set -e

# mac下如果使用自带的sed命令需要修改为以下
/usr/bin/sed -i "" 's#/doc/#/chameleon/doc/#g' "book.json"

if [ ! -d "./${PROJECT_NAME}" ];then
git clone -b gh-pages ${GIT_SITE}:${TEAM_NAME}/${PROJECT_NAME}.git  --depth=1
else
cd ./${PROJECT_NAME}
git pull
cd ../
fi

cd ./website/
npm i
npm run build
cp -rf ./target/* ../${PROJECT_NAME}/
cd ../

gitbook install && gitbook build && rm -rf ./${PROJECT_NAME}/doc && mv -f ./_book ./${PROJECT_NAME}/doc
rm -rf ./${PROJECT_NAME}/doc/website

# mac下如果使用自带的sed命令需要修改为以下
/usr/bin/sed -i "" 's#/chameleon/doc/#/doc/#g' "book.json"

cd ./${PROJECT_NAME}
git checkout -b gh-pages
git add .
exit
git commit -am "help document"
git push origin gh-pages
cd ../
