# minimal-react

Super minimal `react` environment. No automatic build. Run `webpack` to compile your code.
Contains a simple webserver in nodejs.

Code:
  - webserver: server.js
  - React app: in `src`

# Installation 

Type `yarn`

# Running

In one terminal:  `node server.js`
  - reads web content from `dist` folder
  
In another: `yarn build`
  - web app is built into `dist` folder
  - `yarn buildprod` builds a production build, better but slower.
