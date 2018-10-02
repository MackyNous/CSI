# Cybersecurity Services Infrastructure (CSI) [![Build Status](https://travis-ci.org/MackyNous/CSI.svg?branch=master)](https://travis-ci.org/MackyNous/CSI)

CSI is a distributed (service-oriented) infrastructure ***intended solely for 
educational purposes*** (and should never be used in a production environment).

At the core is a generic REST server that accepts server specifications,
which are then executed to start what we call **subservers**.
**IMPORTANT NOTE**: this server accepts and executes executable
JavaScipt code. This approach is suitable in our context of education,
but should never be used in a production environment.

The file launcher.js launches a number of services, including

* YellowPages: a subscription service where services can find eachother
	* provide: here, a server describes a service that it offers.
	* require: here, a server describes all services that it needs.  
		For each required service, the requestor will receive a /fulfill message describing  
		a provider (either immediately or as soon as the service is 'provided')
* IDManager: a service persisting user names and hashed passwords
	* verify: check if the offered credentials are bona fide
* AccessManager: a service which checks access rights/roles
	* verify: checks if a user has the required right/role
* Login: allows users to log in on HTML pages
	* keyexchange: create secure communication (shared secret)
	* login: secure login

## Getting Started [local] ![node (tag)](https://img.shields.io/node/v/passport/latest.svg) 

See generic info on cloning a github repo

### Prerequisites 

Recent node.js, see [nodejs.org](https://nodejs.org/en/)

e.g. download Win msi, Mac pkg or tarball

#### modules
[![NPM](https://nodei.co/npm/hapi.png?compact=true)](https://nodei.co/npm/hapi/) [![NPM](https://nodei.co/npm/request-promise.png?compact=true)](https://nodei.co/npm/request-promise/) [![NPM](https://nodei.co/npm/request.png?compact=true)](https://nodei.co/npm/request/)


### Installing

install npm and run the script (debian as an example): 
```zsh
$ sudo apt install npm
$ npm install 
$ npm start
```
Last step is to visit `jsoneditor.html` and press `login`

(currently jsoneditor has dummy data and doesn't do much

## Getting Started [Docker] ![Docker Automated build](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg) 

First we need to install docker to run everything:

For Debian based systems:
```zsh
sudo apt install docker

# Start docker
sudo systemctl start docker

# Test if docker works correctly
sudo docker run hello-world
```

For Arch based systems:
```zsh
sudo pacman -Syu
sudo pacman -S docker

# Start docker
sudo systemctl start docker

# Test if docker works correctly
sudo docker run hello-world
```

For centOS based systems: 
```zsh
$ sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
  
$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
    
$ sudo yum install docker-ce

$ sudo systemctl start docker

# Test if docker works
$ sudo docker run hello-world
```
## Inventory Management System
Team VT03 has made beginning for a Inventory Management System. If you want to use this functionaliy you can follow these instructions:

First, move the content of the front-end folder and a copy of nocrypto.js into /var/www/html

Start apache2 service:
```zsh
$ sudo service apache2 start
```

Install some extra dependencies (if not present) inside the CSI folder 

```zsh
$ sudo npm install inert
$ sudo npm install load-json-file

```
Start genericServer.js and database.js:
```zsh
$ sudo node genericServer.js
$ sudo node database.js

```

Last step is to visit http://127.0.0.1/login and try to login with root & secretPassword1




## Authors

* **Pum Walters** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)
* **Maricio Jongma** - *Dockerizing and setup fixes* - [CSI_Fork_MackyNous](https://github.com/MackyNous/CSI)
* **VT03 DevOps** - *Inventory Management System module + front-end for login* - [CSI_Fork_windowsboot](https://github.com/windowsboot/CSI)

See also the list of [contributors](https://github.com/MackyNous/CSI/graphs/contributors) who participated in this project.

## License [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

This project is licensed under the MIT License.  
Copyright (c) 2018 Pum Walters, HvA

To see the full licence see the file calles: 'LICENSE' 


## Acknowledgements

### Professors

* Pum Walters
* James Watson

### Students

## Technotes

### Messages

```js
jsoneditor
	#login:
		=> keyexchange(sessionID, pubsecr, halfsecr)
		  <= (halfsecret)//sharedsecret
	#connect
		=> login(uname, pw)
		  <= sessionToken
yp
	=> provides(desc)
	=> require([ip], port, srvcs)
idMngr
	=> verify(sid, name, pw)
		<= OK/KO
accessMngr
	=> verify(name, right)
		<= OK/KO
login
	=> fulfill(port, srvc, ...)
	=> keyExchange(sessionID, pubSecr, halfSecr)
	  <= halfSecr
	~=> login(pw, uname)
		=> ID-Mngr
			+=> verify/uname{pw)
	<= token
```	
