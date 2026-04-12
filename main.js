import { setGLContext } from "./modules/gl.js";
import ExampleApp from "./modules/examples/example_app.js";
import EmptyApp from "./modules/empty_app.js";
import GammaApp from "./modules/examples/gamma_app.js";
import Assignment2App from "./modules/assignment/assignment2.js";

/*
    WebGL app list whose entries are shown above gl canvas.
    Each app must be registered as
    (unique key) : {app: extension of cs380.BaseApp, title: string}
*/
const apps = {
  example: {
    app: ExampleApp,
    title: "Basic example",
  },
  empty: {
    app: EmptyApp,
    title: "Empty",
  },
  gamma: {
    app: GammaApp,
    title: "Gamma",
  },
  assignment2: {
    app: Assignment2App,
    title: "Assignment 2",
  },
};

// Key of the very first app once you access localhost:8000
const defaultApp = "example"; //for ExampleApp

function main() {
  const canvas = document.querySelector("#glcanvas");

  // Initialize the GL context
  const gl = canvas.getContext("webgl2", { stencil: true });
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); //https://jameshfisher.com/2020/10/22/why-is-my-webgl-texture-upside-down/

  // If we don't have a GL context, give up now
  // Only continue if WebGL is available and working
  if (!gl) {
    alert("Unable to initialize WebGL. Try using the latest web browsers.");
    return;
  }
  setGLContext(gl);

  // Initialize app-selection list
  const input = document.getElementById("app-selection");
  for (const key in apps) {
    const { title } = apps[key];
    const opt = document.createElement("option");
    opt.value = key;
    opt.innerHTML = title;
    if (key === defaultApp) {
      opt.setAttribute("selected", "selected");
    }
    input.appendChild(opt);
  }

  let currentApp;
  input.onchange = () => {
    if (currentApp) {
      currentApp.stop();
      currentApp.finalize();
      document.getElementById("settings").innerHTML = "";
    }

    // replace currentApp with the new choice
    const { app } = apps[input.value] ?? {};
    if (app) {
      currentApp = new app();
      currentApp.run();
    }
  };
  input.onchange();
}

main();
