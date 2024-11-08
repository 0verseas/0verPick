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

## Deploy Docker Develop Environment 🐳
Just need to modify related documents(env.js, .env, docker-compose.yml)

First of all, git clone https://github.com/0verseas/0verPick.git then switch folder to 0verPick/, if dev then git clone https://github.com/0verseas/0verPick.git ./0verPick-dev/ and do below
  - ``cd 0verPick/`` or ``cd 0verPick-dev/``
    - switch git branch(if dev then do this step)
      - ``sudo git checkout dev``
    - ``sudo cp config.js.example src/js/config.js``
    - edit src/js/config.js (modify apiBase, reCAPTCHA_site_key)
    - docker build
      - ``sudo npm run docker-build'``

Secondly, switch folder to 0verPick/docker/ or 0verPick-dev/docker/ and do below
- ``cd docker/``
  - ``sudo cp .env.example .env``
  - edit .env (modify NETWORKS, DOMAIN_NAME, ENTRYPOINTS)
  - if you want to exclude IPs other than ours then edit docker-compose.yml open ncnuipwhitlist@file label setting

Finally, did all the above mentioned it after that the last move is docker-compose up
- ``sudo docker-compose up -d``

If want to stop docker-compose
- ``sudo docker-compose down``

if don‘t want to stop container and apply docker-compose edited setting then
- ``sudo docker-compose up --detach``