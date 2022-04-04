set -x

git pull
#yarn install
yarn build
sudo rm -rf /var/www/iptv_html
sudo cp build  /var/www/iptv_html -r
