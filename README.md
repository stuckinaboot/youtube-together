# :sunny: Youtube Sync - Synchronized YouTube Player built in react

> Synchronized YouTube player that let friends watch videos together regardless of geograpic location

> Host the server and embed the youtube sync session in an iframe, allowing you to use this out of the box on any website for any use case

### Technologies

- React.js
- CSS
- Node.js
- Websockets
- Express

### Setup

```
cd client
yarn
yarn build
cd ../server
yarn
yarn start
```

### How to

To create a new youtube sync session, open your browser and visit `localhost:8088/start/choose_session_id/encoded_youtube_url`, where `choose_session_id` is any alphanumeric string and `encoded_youtube_url` is the link to a youtube video encoded using encodeURIComponent.

Example of creating a new session with session id `abc123` and youtube url `https://www.youtube.com/watch?v=yB1xfGv_PY8`: `localhost:8088/start/abc123/https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DjEJUa64NU7s`

Then, to join somebody else's existing youtube sync session, visit `localhost:8088/watch/abc123` in a new browser.

### Contributing

#### Submitting Issues

If you notice any bugs, create a GitHub issue with the title being a very short summary of the problem, e.g. `Sync not working on start`, and the description being the _exact_ steps to reproduce the issue. If we do not have the _exact_ steps, we can't figure out what's wrong and can't fix it.

If you notice any room for improvement, create a GitHub issue with the title being a very short summary of the improvement, e.g. `Improve session scalability`, and the description being the improvement you would like to see made. Feel free to add hints on the approach you woul take.

#### Contributing

Thank you for deciding to contribute! Pick a GitHub issue that you would like to address (or add your own), and then assign yourself to that issue. Then, fork the repo and add any changes you would like to make to that fork. Currently, we don't have tests in place so please be sure to test various scenarios locally before deciding your changes are ready to submit. When you would like to submit your changes for review, create a pull request and I will review/test it myself as soon as possible.

**The main two files that are related to youtube sync and the scalability of the end-to-end process are `client/Video.js` and `server/server.js`**.

Please contribute! This project needs scalability and sync improvements to allow its full potential to be reached!

If you have any questions at all, please feel free to contact me on [linkedin](https://www.linkedin.com/in/aspyn-palatnick-577270131/) and I'll get back to you as soon as possible.

### Inspiration

Project inspired by [@YasserYka](https://github.com/YasserYka/YT-API).

### Credit

The overwhelming majority of this was built by [@filahf](https://www.filipahfelt.se/), and can be seen on his youtube sync website https://wevid.online/. I (@stuckinaboot) just simplified the code to make using this within an iframe trivial.

### Contributors

[@filahf](https://github.com/filahf) [@stuckinaboot](https://github.com/stuckinaboot)
