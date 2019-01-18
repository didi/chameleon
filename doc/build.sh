set -e

sed -i "s#/doc/#/chameleon/doc/#g" "book.json"
gitbook install && gitbook build ./ ./_tmpbook/doc
sed -i "s#/chameleon/doc/#/doc/#g" "book.json"

cd ./website/
npm i
npm run build
mv -f ./target/* ../_tmpbook/
cd ../
