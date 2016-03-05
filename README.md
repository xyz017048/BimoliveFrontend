# BimoLiveFrontEnd #
Official repository for Bimolive.com front end code.

# Developing on Local
Clone the repository
``` bash
git clone https://your_username@bitbucket.org/the_pros/bimoliveangularfrontend.git bimoliveAngularFrontEnd
```

Install nodejs and npm if you haven't installed before
[https://nodejs.org/en/](https://nodejs.org/en/)

Install things on your machine
```bash
sudo npm install -g grunt-cli bower yo generator-karma generator-angular
sudo npm install
```

Change directory to bimoliveFrontEnd directory
```bash
cd bimoliveAngularFrontEnd
```

## Build & development

Run `grunt` for building and `grunt serve` for preview.

Run html2jade to compile a jade file
```bash
html2jade index.html > index.jade
```

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000
```

Run server
```bash
forever start server.js
```
To end server

```bash
forever stop 0
```

## Testing

Running `grunt test` will run the unit tests with karma.

To stop grunt, simply press ctrl + c