set -x

git pull
#yarn install
yarn build
sudo rm -rf /var/www/iptv_html
sudo cp build  /var/www/iptv_html -r
sudo cp nginx-conf/iptv.conf /etc/nginx/sites-enabled
sudo nginx -s reload

