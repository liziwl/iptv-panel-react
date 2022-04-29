set -x

git pull
# rm -rf node_modules
#yarn install
yarn build
sudo rm -rf /var/www/iptv_html
sudo cp build  /var/www/iptv_html -r
