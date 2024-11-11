# 0verPick
For schools to pick students they want.

## Deploy Local Develop Environment
### Install
```
git clone https://github.com/0verseas/0verPick.git
cd 0verPick
npm install
cp config.js.example src/js/config.js
```
edit the config file in `src/js/config.js`

### Run
```
npm run webpack
npm run serve
```

### Deploy
```
npm run build
```
the built static files will be in the `dist`

## Deploy Docker Develop Environment
### Startup Preparation
if dev then
```
git clone https://github.com/0verseas/0verPick.git ./0verPick-dev/
cd ./0verPick-dev/
git checkout dev
```
if official then
```
git clone https://github.com/0verseas/0verPick.git
cd ./0verPick/
```

```
npm install
cp ./config.js.example ./src/js/config.js
cp ./docker/.env.example ./docker/.env
```
#### Edit Config Files
modify apiBase, isProduction, reCAPTCHA_site_key
```
vim ./src/js/config.js
```
modfiy NETWORKS, DOMAIN_NAME, ENTRYPOINTS
*If dev then modfiy COMPOSE_PROJECT_NAME and CONTAINER_NAME*
```
vim ./docker/.env
```
#### *If want Container Block Exclude IPs Other than Ours*
modify uncomment row 28
```
vim ./docker/docker-compose.yaml
```
### Build
```
sudo npm run docker-build
```
### StartUp
*at ./docker/ path*
```
sudo docker-compose up -d
```
### Stop
*at ./docker/ path*
```
sudo docker-compose down
```
### ✨Nonstop Container and Apply New Edit Docker-Compose Setting (Use Only Container is running)✨
The command will not effect on the running container if you have not edited any of the settings on docker-compose.yaml
*at ./docker/ path*
```
sudo docker-compose up --detach
```