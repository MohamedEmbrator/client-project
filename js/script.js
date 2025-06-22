const scrollButton = document.querySelector(".scroll-button");
const scrollProgressParentElement = document.querySelector(".scroll-progress");
const scrollProgress = document.querySelector(".scroll-progress div");
window.onscroll = () => {
  scrollProgressParentElement.style.display = "block";
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollTop = document.documentElement.scrollTop;
  scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
  if (window.scrollY >= 600) {
    scrollButton.style.display = "flex";
  } else {
    scrollButton.style.display = "none";
  }
};
scrollButton.onclick = function () {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth"
  });
};
// Settings Box
document.querySelector(".settings-box .settings-icon").onclick = () => {
  document.querySelector(".settings-box .icon").classList.toggle("fa-spin");
  document.querySelector(".settings-box").classList.toggle("open");
};
const colors = document.querySelectorAll(".colors-list li");
let backgroundOption = true;
let backgroundInterval;
if (window.localStorage.getItem("main_color") !== null) {
  document.documentElement.style.setProperty(
    "--main-color",
    window.localStorage.getItem("main_color")
  );
  document.documentElement.style.setProperty(
    "--main-color-alt",
    window.localStorage.getItem("main_color_alt")
  );
  colors.forEach((color) => {
    color.classList.remove("active");
    if (color.dataset.color === window.localStorage.getItem("main_color")) {
      color.classList.add("active");
    }
  });
}
colors.forEach((color) => {
  color.style.backgroundColor = color.dataset.color;
  color.addEventListener("click", (e) => {
    document.documentElement.style.setProperty(
      "--main-color",
      e.target.dataset.color
    );
    document.documentElement.style.setProperty(
      "--main-color-alt",
      e.target.dataset.coloralt
    );
    window.localStorage.setItem("main_color", e.target.dataset.color);
    window.localStorage.setItem("main_color_alt", e.target.dataset.coloralt);
    colors.forEach((color) => {
      color.classList.remove("active");
    });
    e.target.classList.add("active");
  });
});
const randomBackgroundButtons = document.querySelectorAll(
  ".random-backgrounds span"
);
randomBackgroundButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    randomBackgroundButtons.forEach((button) => {
      button.classList.remove("active");
    });
    e.target.classList.add("active");
    if (e.target.classList.contains("on")) {
      backgroundOption = true;
      randomizeBackground();
      window.localStorage.setItem("background_option", true);
    } else {
      backgroundOption = false;
      clearInterval(backgroundInterval);
      window.localStorage.setItem("background_option", false);
    }
  });
});
document.querySelector(".reset-options").onclick = function () {
  localStorage.clear();
  window.location.reload();
};
// Other
const btn = document.querySelector("header .container .btn");
const navigatinBar = document.querySelector("header .container .navigation ul");
const allLis = document.querySelectorAll("header .container .navigation ul li");

btn.addEventListener("click", function () {
  navigatinBar.classList.toggle("show");
});

allLis.forEach(function (e) {
  e.onclick = function () {
    navigatinBar.classList.remove("show");
  };
});
document.addEventListener("click", function (event) {
  if (!navigatinBar.contains(event.target) && !btn.contains(event.target)) {
    navigatinBar.classList.remove("show");
  }
});
let copyRight = document.querySelector("footer .container .footer-title sub");

copyRight.innerHTML = new Date().getFullYear();

// Landing Image
const landing = document.querySelector(".landing .container .image img");
const imgs = ["landing-01.jpg", "landing-02.jpg", "landing-03.jpg"];
let backgroundOptionValue = window.localStorage.getItem("background_option");
if (backgroundOptionValue !== null) {
  if (backgroundOptionValue === "true") {
    backgroundOption = true;
    document.querySelector(".random-backgrounds .on").click();
  } else {
    backgroundOption = false;
    document.querySelector(".random-backgrounds .off").click();
  }
}
function randomizeBackground() {
  if (backgroundOption) {
    backgroundInterval = setInterval(function () {
      const randomNumber = Math.floor(Math.random() * imgs.length);
      landing.src = `imgs/${imgs[randomNumber]}`;
    }, 3000);
  }
}
randomizeBackground();
// Internet Connection
const onlineMessage = document.querySelector(".online");
const offlineMessage = document.querySelector(".offline");
let connectionButton = document.querySelectorAll(".close");

window.addEventListener("online", function () {
  onlineMessage.style.display = "flex";
  offlineMessage.style.display = "none";
  setTimeout(function () {
    if (onlineMessage.style.display === "flex") {
      onlineMessage.style.display = "none";
    } else {
      onlineMessage.style.display = "flex";
    }
  }, 10000);
});
window.addEventListener("offline", function () {
  onlineMessage.style.display = "none";
  offlineMessage.style.display = "flex";
});
connectionButton.forEach(function (el) {
  addEventListener("click", function () {
    el.parentElement.style.display = "none";
  });
});
// Drak Mode
const darkModeButtons = document.querySelectorAll(
  ".settings-box .dark-mode span"
);
let darkModeLocalStorage = window.localStorage.getItem("dark_mode");
if (darkModeLocalStorage != null) {
  document.body.classList.add("dark");
  darkModeButtons.forEach((el) => {
    el.classList.remove("active");
    document
      .querySelector(".settings-box .dark-mode .on")
      .classList.add("active");
  });
}
darkModeButtons.forEach((el) => {
  el.addEventListener("click", function (e) {
    darkModeButtons.forEach((element) => element.classList.remove("active"));
    e.target.classList.add("active");
    if (e.target.classList.contains("on")) {
      document.body.classList.add("dark");
      window.localStorage.setItem("dark_mode", "dark");
    } else {
      document.body.classList.remove("dark");
      window.localStorage.removeItem("dark_mode");
    }
  });
});
// Language Switch
const languageButtons = document.querySelectorAll(
  ".settings-box .language span"
);

languageButtons.forEach((el) => {
  el.addEventListener("click", function (e) {
    languageButtons.forEach((element) => element.classList.remove("active"));
    e.target.classList.add("active");
  });
});

document.querySelector(".loading").style.display = "none";
async function getArticles() {
  document.querySelector(".loading").style.display = "block";
  await fetch(
    "https://www.googleapis.com/blogger/v3/blogs/2751603337577110409/posts?key=AIzaSyBMNdHAqDUMki47IJccq052xzmAW5ZYkzI"
  )
    .then((result) => result.json())
    .then((data) => {
      data.items.forEach(function (post) {
        const articles = document.querySelector(".articles .container");
        const mainBox = document.createElement("div");
        mainBox.classList.add("box");
        const parser = new DOMParser();
        const doc = parser.parseFromString(post.content, "text/html");
        const firstImage = doc.querySelector("img");
        const img = document.createElement("img");
        img.setAttribute("alt", "Article Preview");
        img.src = firstImage ? firstImage.src : "imgs/landing-02.jpg";
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        const contentHeading = document.createElement("h3");
        contentHeading.innerHTML = post.title;
        const contentP = document.createElement("p");
        contentP.innerHTML = `Published: ${post.published.slice(
          0,
          10
        )} <br> Updated: ${post.updated.slice(0, 10)}`;
        contentDiv.append(contentHeading, contentP);
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");
        infoDiv.onclick = function () {
          window.open(post.url, "_blank");
        };
        const infoLink = document.createElement("a");
        infoLink.setAttribute("target", "_blank");
        infoLink.href = post.url;
        infoLink.innerHTML = "Read More";
        const infoIcon = document.createElement("i");
        infoIcon.classList.add("fa-solid", "fa-arrow-right-long");
        infoDiv.append(infoLink, infoIcon);
        mainBox.append(img, contentDiv, infoDiv);
        articles.appendChild(mainBox);
      });
    });
  document.querySelector(".loading").style.display = "none";
}
getArticles();

/*

// Main App Class
class App {
  constructor() {
    this.scrollManager = new ScrollManager();
    this.settingsBox = new SettingsBox();
    this.colorManager = new ColorManager();
    this.backgroundManager = new BackgroundManager();
    this.navbarManager = new NavbarManager();
    this.landingManager = new LandingManager();
    this.connectionStatus = new ConnectionStatus();
    this.darkMode = new DarkMode();
    this.languageSwitcher = new LanguageSwitcher();
    this.articleLoader = new ArticleLoader();
  }
}

class ScrollManager {
  constructor() {
    this.scrollButton = document.querySelector(".scroll-button");
    this.scrollProgressParentElement = document.querySelector(".scroll-progress");
    this.scrollProgress = document.querySelector(".scroll-progress div");
    this.init();
  }
  init() {
    window.onscroll = () => {
      this.scrollProgressParentElement.style.display = "block";
      let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let scrollTop = document.documentElement.scrollTop;
      this.scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
      this.scrollButton.style.display = window.scrollY >= 600 ? "flex" : "none";
    };
    this.scrollButton.onclick = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };
  }
}

class SettingsBox {
  constructor() {
    this.icon = document.querySelector(".settings-box .settings-icon");
    this.box = document.querySelector(".settings-box");
    this.resetButton = document.querySelector(".reset-options");
    this.icon.addEventListener("click", () => this.toggleSettings());
    this.resetButton.addEventListener("click", () => this.resetOptions());
  }
  toggleSettings() {
    document.querySelector(".settings-box .icon").classList.toggle("fa-spin");
    this.box.classList.toggle("open");
  }
  resetOptions() {
    localStorage.clear();
    window.location.reload();
  }
}

class ColorManager {
  constructor() {
    this.colors = document.querySelectorAll(".colors-list li");
    this.init();
  }
  init() {
    let mainColor = localStorage.getItem("main_color");
    if (mainColor) {
      document.documentElement.style.setProperty("--main-color", mainColor);
      document.documentElement.style.setProperty("--main-color-alt", localStorage.getItem("main_color_alt"));
      this.colors.forEach(color => {
        color.classList.remove("active");
        if (color.dataset.color === mainColor) color.classList.add("active");
      });
    }
    this.colors.forEach(color => {
      color.style.backgroundColor = color.dataset.color;
      color.addEventListener("click", e => this.changeColor(e.target));
    });
  }
  changeColor(target) {
    document.documentElement.style.setProperty("--main-color", target.dataset.color);
    document.documentElement.style.setProperty("--main-color-alt", target.dataset.coloralt);
    localStorage.setItem("main_color", target.dataset.color);
    localStorage.setItem("main_color_alt", target.dataset.coloralt);
    this.colors.forEach(color => color.classList.remove("active"));
    target.classList.add("active");
  }
}

class BackgroundManager {
  constructor() {
    this.backgroundOption = true;
    this.backgroundInterval = null;
    this.buttons = document.querySelectorAll(".random-backgrounds span");
    this.landing = document.querySelector(".landing .container .image img");
    this.imgs = ["landing-01.jpg", "landing-02.jpg", "landing-03.jpg"];
    this.init();
  }
  init() {
    const savedOption = localStorage.getItem("background_option");
    if (savedOption !== null) {
      this.backgroundOption = savedOption === "true";
      document.querySelector(`.random-backgrounds .${this.backgroundOption ? 'on' : 'off'}`).click();
    }
    this.buttons.forEach(button => {
      button.addEventListener("click", e => this.toggleRandomBackground(e.target));
    });
    this.randomizeBackground();
  }
  toggleRandomBackground(target) {
    this.buttons.forEach(btn => btn.classList.remove("active"));
    target.classList.add("active");
    this.backgroundOption = target.classList.contains("on");
    localStorage.setItem("background_option", this.backgroundOption);
    if (this.backgroundOption) this.randomizeBackground();
    else clearInterval(this.backgroundInterval);
  }
  randomizeBackground() {
    if (this.backgroundOption) {
      this.backgroundInterval = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * this.imgs.length);
        this.landing.src = `imgs/${this.imgs[randomNumber]}`;
      }, 3000);
    }
  }
}

class NavbarManager {
  constructor() {
    this.btn = document.querySelector("header .container .btn");
    this.navbar = document.querySelector("header .container .navigation ul");
    this.lis = document.querySelectorAll("header .container .navigation ul li");
    this.init();
  }
  init() {
    this.btn.addEventListener("click", () => this.navbar.classList.toggle("show"));
    this.lis.forEach(li => li.addEventListener("click", () => this.navbar.classList.remove("show")));
    document.addEventListener("click", e => {
      if (!this.navbar.contains(e.target) && !this.btn.contains(e.target)) {
        this.navbar.classList.remove("show");
      }
    });
  }
}

class LandingManager {
  constructor() {
    document.querySelector("footer .container .footer-title sub").innerHTML = new Date().getFullYear();
  }
}

class ConnectionStatus {
  constructor() {
    this.onlineMessage = document.querySelector(".online");
    this.offlineMessage = document.querySelector(".offline");
    this.closeButtons = document.querySelectorAll(".close");
    this.init();
  }
  init() {
    window.addEventListener("online", () => this.showOnline());
    window.addEventListener("offline", () => this.showOffline());
    this.closeButtons.forEach(btn => btn.addEventListener("click", () => btn.parentElement.style.display = "none"));
  }
  showOnline() {
    this.onlineMessage.style.display = "flex";
    this.offlineMessage.style.display = "none";
    setTimeout(() => this.onlineMessage.style.display = "none", 10000);
  }
  showOffline() {
    this.onlineMessage.style.display = "none";
    this.offlineMessage.style.display = "flex";
  }
}

class DarkMode {
  constructor() {
    this.buttons = document.querySelectorAll(".settings-box .dark-mode span");
    this.init();
  }
  init() {
    let saved = localStorage.getItem("dark_mode");
    if (saved) {
      document.body.classList.add("dark");
      this.activate("on");
    }
    this.buttons.forEach(btn => btn.addEventListener("click", e => this.toggle(e.target)));
  }
  activate(type) {
    this.buttons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.settings-box .dark-mode .${type}`).classList.add("active");
  }
  toggle(target) {
    this.activate(target.classList.contains("on") ? "on" : "off");
    if (target.classList.contains("on")) {
      document.body.classList.add("dark");
      localStorage.setItem("dark_mode", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.removeItem("dark_mode");
    }
  }
}

class LanguageSwitcher {
  constructor() {
    this.buttons = document.querySelectorAll(".settings-box .language span");
    this.buttons.forEach(btn => btn.addEventListener("click", e => this.switch(e.target)));
  }
  switch(target) {
    this.buttons.forEach(btn => btn.classList.remove("active"));
    target.classList.add("active");
  }
}

class ArticleLoader {
  constructor() {
    this.loading = document.querySelector(".loading");
    this.container = document.querySelector(".articles .container");
    this.load();
  }
  async load() {
    this.loading.style.display = "block";
    const res = await fetch("https://www.googleapis.com/blogger/v3/blogs/2751603337577110409/posts?key=AIzaSyBMNdHAqDUMki47IJccq052xzmAW5ZYkzI");
    const data = await res.json();
    data.items.forEach(post => this.renderPost(post));
    this.loading.style.display = "none";
  }
  renderPost(post) {
    const box = document.createElement("div");
    box.classList.add("box");
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const firstImage = doc.querySelector("img");
    const img = document.createElement("img");
    img.alt = "Article Preview";
    img.src = firstImage ? firstImage.src : "imgs/landing-02.jpg";
    const content = document.createElement("div");
    content.classList.add("content");
    const h3 = document.createElement("h3");
    h3.innerHTML = post.title;
    const p = document.createElement("p");
    p.innerHTML = `Published: ${post.published.slice(0, 10)} <br> Updated: ${post.updated.slice(0, 10)}`;
    content.append(h3, p);
    const info = document.createElement("div");
    info.classList.add("info");
    info.onclick = () => window.open(post.url, "_blank");
    const link = document.createElement("a");
    link.href = post.url;
    link.target = "_blank";
    link.innerHTML = "Read More";
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-arrow-right-long");
    info.append(link, icon);
    box.append(img, content, info);
    this.container.appendChild(box);
  }
}

// Start the App
new App();


*/