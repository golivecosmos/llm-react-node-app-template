# LLM React App Javascript Template

## What is a LLM React App Javascript Template?

This a template project for a simple chat app connected to a Large Language Model (LLM). This is built on top of [the React template app from nano-react-app](https://github.com/nano-react-app/template-js). To connect the React app to an LLM, a Node server has been added to the project.

These are the available commands:

- `npm start-server` — This will start a development node backend server with a default port of `3100`.
- `npm start` — This will start a development server for the react frontend app with a default port of `5173`.
- `npm run build` — This will output a production build in the `dist` directory.
- `npm run preview` — This will run the production build locally with a default port of `5173` (this will not work if you haven't generated the production build yet).

## Getting Started

To get started, create a `.env` file by copying the `SAMPLE_env` file. Then, add your Open API key to the file.
Now you are ready to run the server and the web app.

## Custom port

You can use the `-p` flag to specify a port for development. To do this, you can either run `npm start` with an additional flag:

```bash
npm start -- --port 3000
```

Or edit the `start` script directly:

```bash
vite --port 3000
```

## Adding styles

You can use CSS files with simple ES2015 `import` statements anywhere in your Javascript:

```js
import "./index.css";
```

## Babel transforms

The Babel preset [babel-preset-nano-react-app](https://github.com/nano-react-app/babel-preset-nano-react-app) is used to support the same transforms that Create React App supports.

The Babel configuration lives inside `package.json` and will override an external `.babelrc` file, so if you want to use `.babelrc` remember to delete the `babel` property inside `package.json`.

## Deploy to GitHub Pages

You can also deploy your project using GitHub pages.
First install the `gh-pages` [package](https://github.com/tschaub/gh-pages):

`npm i -D gh-pages`

Use the following scripts for deployment:

```js
"scripts": {
  "start": "vite",
  "build": "vite build",
  "predeploy": "rm -rf dist && vite build",
  "deploy": "gh-pages -d dist"
},
```

Then follow the normal procedure in GitHub Pages and select the `gh-pages` branch.
