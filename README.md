# :sunny: Youtube Sync - Synchronized YouTube Player built in react

> Synchronized YouTube player that let friends watch videos together regardless of geograpic location

> Host the server and embed the youtube sync session in an iframe, allowing you to use this out of the box on any website for any use case

## Usage from NPM ⚡

### Quickstart

Install youtube-together with `npm install youtube-together --save`. Start youtube-together server with `cd node_modules/youtube-together && npm start`. Scroll down to _How to_ to get started creating your first youtube-together session.

To use a port other than the default server port (8000), run `cd node_modules/youtube-together && PORT=8123 npm start`, 8123 can be replaced by whatever port your heart desires.

### Integrating the youtube-together server into your code

To start the `youtube-together` server:

```
const startServer = require("youtube-together");
startServer();
```

To start `youtube-together` as an https server:

```
const startServer = require("youtube-together");
startServer({
  keyFilePath: "your_ssl_private.key",
  certFilePath: "your_ssl_certificate.crt",
  caFilePath: "your_ssl_ca_bundle.crt",
});
```

#### Choose a port

To start the `youtube-together` server on a specific port:

```
const startServer = require("youtube-together");
startServer(undefined, 443);
```

To start the `youtube-together` https server on a specific port:

```
const startServer = require("youtube-together");
startServer({
  keyFilePath: "your_ssl_private.key",
  certFilePath: "your_ssl_certificate.crt",
  caFilePath: "your_ssl_ca_bundle.crt",
}, 443);
```

## Setup from GitHub repo 🖥️

```
cd client
yarn
yarn build
cd ../server
yarn
yarn start
```

## How to 📜

To create a new youtube sync session, open your browser and visit `localhost:8000/start/choose_session_id/encoded_youtube_url`, where `choose_session_id` is any alphanumeric string and `encoded_youtube_url` is the link to a youtube video encoded using `encodeURIComponent`.

Example of creating a new session with session id `abc123` and youtube url `https://www.youtube.com/watch?v=yB1xfGv_PY8`: `localhost:8000/start/abc123/https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DjEJUa64NU7s`

Then, to join somebody else's existing youtube sync session, visit `localhost:8000/watch/abc123` in a new browser.

All youtube-together session urls can easily be embedded in an iframe to easily allow users to watch youtube videos together on your platform.

## Contributing ❤️

### Submitting Issues

If you notice any bugs, create a GitHub issue with the title being a very short summary of the problem, e.g. `Sync not working on start`, and the description being the _exact_ steps to reproduce the issue. If we do not have the _exact_ steps, we can't figure out what's wrong and can't fix it.

If you notice any room for improvement, create a GitHub issue with the title being a very short summary of the improvement, e.g. `Improve session scalability`, and the description being the improvement you would like to see made. Feel free to add hints on the approach you would take.

### Addressing Issues

Thank you for deciding to contribute! Pick a GitHub issue that you would like to address (or add your own), and then assign yourself to that issue. Then, fork the repo and add any changes you would like to make to that fork. Currently, we don't have tests in place so please be sure to test various scenarios locally before deciding your changes are ready to submit. When you would like to submit your changes for review, create a pull request, list the specific changes that you made, and I will review/test it myself as soon as possible.

**The main two files that are related to youtube sync and the scalability of the end-to-end process are `client/Video.js` and `server/server.js`**.

Please contribute! This project needs scalability and sync improvements to allow its full potential to be reached!

If you have any questions at all, please feel free to contact me on [linkedin](https://www.linkedin.com/in/aspyn-palatnick-577270131/) and I'll get back to you as soon as possible.

## Contributors 🔥

[@filahf](https://github.com/filahf) [@stuckinaboot](https://github.com/stuckinaboot)

### Credit for Project Start

The overwhelming majority of this was built by [@filahf](https://www.filipahfelt.se/), and can be seen on his youtube sync website https://wevid.online/. I (@stuckinaboot) just simplified the code to make using this within an iframe trivial. Some core youtube sync ideas were used from [@YasserYka](https://github.com/YasserYka/YT-API).
