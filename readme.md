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
Just need to modify related documents(env.js, .env, docker-compose.yaml)

First of all, git clone https://github.com/0verseas/0verPick.git than switch folder to 0verPick/, and do below
  - ``cd 0verPick/``
    - switch git branch
      - ``sudo git checkout dev``
    - ``sudo cp config.js.example src/js/config.js``
    - edit src/js/config.js (modify apiBase, reCAPTCHA_site_key)
    - docker build
      - ``sudo docker run -it --rm -v $PWD:/0verPick -w /0verPick node:14.16.0 sh -c 'npm install && npm run build'``

Secondly, switch folder to 0verPick/docker/ and do below
- ``cd docker/``
  - ``sudo cp .env.example .env``
  - edit .env (modify NETWORKS)
  - edit docker-compose.yml (modify the container's label which "traefik.http.routers.pick.rule=Host(`` `input school's domain name here` ``) && PathPrefix(`` `/review` ``)")

Finally, did all the above mentioned it after that the last move is docker-compose up
- ``sudo docker-compose up -d``

If want to stop docker-compose
- ``sudo docker-compose down``
