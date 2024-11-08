### JavaScript Workshop

# Build your first Chrome Extension

SETUP: https://info.lewagon.com/tokyo-chrome-ext

_By [Trouni Tiet](https://linkedin.com/in/trouni) for [Le Wagon Tokyo](https://www.lewagon.com/tokyo), updated by [Ryuichiro Suzuki](https://www.linkedin.com/in/suzukiryuichiro/)_

---

## Setup

All you need for this workshop is [Google Chrome](https://www.google.com/chrome/) or any other chromium based browser, and a text editor or IDE like [Sublime Text](https://www.sublimetext.com/) or [VS Code](https://code.visualstudio.com/download).

##### **TODO:**

Clone the git repository for this workshop

```zsh
git clone https://github.com/SuzukiRyuichiro/workshop-chrome-extension.git
```

**OR** [download the ZIP file](https://github.com/SuzukiRyuichiro/workshop-chrome-extension/archive/master.zip) and unzip the archive to your desktop.

---

With ad blockers, integration to third party apps like Evernote or your favourite to-do app, or many humoristic extensions, Chrome extensions can be extremely powerful, but also very fun to use. The good news is that it's also super easy to build a Chrome extension. This workshop will take you step-by-step through the journey of creating and publishing your first Chrome extension, while teaching you the key concepts to understand.

---

### What to expect from this workshop

bacon 🥓

But also, here are key aspects that we'll be covering:

1. Recap about JavaScript and the DOM
2. Basic structure of a Chrome extension
3. Create a script to interact with a web page
4. Add a popup menu to interact with your extension
5. Publish an extension on the Chrome store

---

## JavaScript/DOM Recap

Before we dive into extensions, let's go through a quick JavaScript recap on how to interact with a web page.

### Chrome Developer Tools

##### **TODO:**

Open the Chrome console:

**`⌘ Cmd + ⌥ Shift + C`** on Mac

**`✲ Ctrl + ⇧ Shift + C`** on Windows

---

### Selecting elements in the DOM

```javascript
// Target the first element matching the CSS selector
document.querySelector(".css-selector");

// Get an array of all the elements matching the CSS selector
document.querySelectorAll(".css-selector");

// Iterate over each selected element
document.querySelectorAll(".css-selector").forEach((element) => {
  console.log(element);
});
```

### Editing an element's attributes

After selecting an HTML element:

```javascript
// Change opacity of the element
element.style.opacity = 0.5;

// Add a CSS class to the element
element.classList.add("hidden");

// Change an image
img.src =
  "https://raw.githubusercontent.com/SuzukiRyuichiro/workshop-chrome-extension/master/images/hedgehog.jpg";
```

---

### User interaction

You can ask the browser to listen for events and trigger actions using `addEventListener()`:

```javascript
element.addEventListener("click", (event) => {
  // Some action
  alert("The event has been triggered");
});
```

Check out the [Event reference documentation](https://developer.mozilla.org/en-US/docs/Web/Events) for a complete list of available events.

---

## Building a "baconifier" Chrome extension

We'll create an extension that replaces all images on a web page with photos of bacon 🥓.

### baconmockup

Let's use [baconmockup](https://source.unsplash.com), a service that will give you a random picture of bacon based on the image size.

##### **TODO:**

Use what we've learned so far to replace all the images on [this website](https://japantoday.com/) with photos of bacon.

**Hint:**

1. Select all `img` elements
2. Iterate over each of them using `forEach`
3. Update the `src` and `srcset` attributes with the Unsplash url

Once this is done, let's put this script in a Chrome extension!

---

### Basic structure of a Chrome extension

The manifest is a simple JSON file that tells the browser about your web application, and it is the only file that every extension using WebExtension APIs must contain.

```javascript
// manifest.json

{
  "manifest_version": 3,
  "name": "My first Chrome Extension",
  "description": "Chrome extension workshop for Le Wagon Tokyo",
  "author": "Your name",
  "version": "1",
  "permissions": ["tabs"],
  "content_scripts": [
    // ...
  ],
  "background": {
    // ...
  },
  "action": {
    // ...
  },
  "icons": {
    "16": "images/icon16.png",
    "32": "images/icon32.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  }
}

```

---

### Loading our extension into Chrome

##### **TODO:**

1. Enter `chrome://extensions` in the Chrome search bar, and activate developer mode (top-right corner)
2. Click '**Load unpacked**' and select your workshop-chrome-extension folder.

---

### Content scripts & Background / Event scripts

<img src="https://raw.githubusercontent.com/SuzukiRyuichiro/workshop-chrome-extension/master/images/chrome-extension-structure.jpg" width="40%">

**Content scripts** run in the context of a web page / tab, and allow you to get information from it, or even change its contents. On the other side, as its name suggests, a **background script** runs in the background of the Chrome browser, acting as a controller and used to maintain state for your extension.

While content scripts have limited access to the Chrome Extension APIs, background scripts can make full use of them. **As a general rule, content scripts should be used to interact with web pages / tabs, while the logic should ideally be located in the background script.**

---

### Creating our first content script

Since it interacts with our page, our image replacing script should go into a content script.

##### **TODO:**

- Add this snippet to the `scripts/baconify.js` file.

```javascript
document.querySelectorAll("img").forEach((img) => {
  img.src = `https://baconmockup.com/${img.width}/${img.height}`;
  img.srcset = img.src;
});
```

---

### Adding our script to the manifest

##### **TODO:**

In your manifest, add the following to run our baconify script on all the pages we visit.

```javascript
// manifest.json

{
  // ...

  "content_scripts": [
    {
      "matches": [
        "<all_urls>"
      ],
      "js": ["scripts/baconify.js"]
    }
  ],

  // ...
}
```

---

## Add a menu to our extension

Our script now runs on every single page we visit, and although I'm definitely loving all that greasy goodness, I can think of a few situations where replacing all images on the internet with photos of fatty chunk of meat may not be entirely relevant. So let's add a menu to our extension, in order to trigger the baconification of our page only when we _actually_ need it.

---

### Creating the menu UI in HTML/CSS

##### **TODO:**

Create your menu or copy-paste the code below into `popup.html`.

```html
<!-- popup.html -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>My first Chrome extension</title>
    <link rel="stylesheet" href="style/popup.css" />
  </head>
  <body>
    <h1>My first Chrome extension</h1>
    <button id="baconify">
      <span>🥓</span>
      <p>Baconify Page</p>
    </button>
    <script src="scripts/popup.js"></script>
  </body>
</html>
```

_I have already included some CSS styling in `style/popup.css` for the template above._

---

### Adding our menu to the manifest

We need to let Chrome know that the menu for our extension is now in our `popup.html` file.

##### **TODO:**

Add this to your manifest.json file.

```javascript
// manifest.json

{
  // ...

  "action": {
    "default_popup": "popup.html",
    "default_title": "Baconify"
  },

  // ...
}
```

---

### Passing messages to tabs / content scripts

When we click the button of our `popup.html` page, we should send a message to the `baconify.js` content script and trigger our image replacement script.

Here are some useful methods to pass messages to content scripts:

```javascript
// Find the tab(s) you want to send a message to by querying the open tabs in Chrome
chrome.tabs.query(queryInfo, responseCallback);

// Send a message to a tab when you know its ID
chrome.tabs.sendMessage(tabId, message, options, responseCallback);
```

_Learn more in the [chrome.tabs API](https://developer.chrome.com/extensions/tabs)._

##### **TODO:**

Let's apply this to our extension and trigger the baconify script when we click on our button.

```javascript
// scripts/popup.js

// Send a message to the active tab to 'baconify' it
const sendBaconifyMsg = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Finds tabs that are active in the current window
    chrome.tabs.sendMessage(tabs[0].id, { action: "baconify" }); // Sends a message (object) to the first tab (tabs[0])
  });
};

// Trigger the function above when clicking the 'baconify' button
document
  .querySelector("#baconify")
  .addEventListener("click", (event) => sendBaconifyMsg());
```

---

### Listening for messages in tabs / content scripts

Now, all that's keeping us from turning our web page into meat eater's heaven is learning how to intercept the message we've just sent, then trigger an action based on that. We will be using the chrome.runtime API and more specifically, the `onMessage.addListener` method:

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // actions based on the request (which corresponds to the object we sent in our message)
});
```

_Learn more in the [chrome.runtime API](https://developer.chrome.com/apps/runtime)._

##### **TODO:**

Complete/replace your code in baconify.js with the one below.

```javascript
// baconify.js

// Our image replacement script
const baconify = () => {
  document.querySelectorAll("img").forEach((img) => {
    img.src = `https://baconmockup.com/${img.width}/${img.height}`;
    img.srcset = img.src;
  });
};

// Listen for messages on the content page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "baconify") baconify();
});
```

Awesome! You should now be able to click on the extension's icon, then click on the 'baconify Page' button to run our baconify script.

---

## Publishing our extension to the store

##### **TODO:**

1. Create your app’s zip file
2. [Create a developer account](https://chrome.google.com/webstore/developer/dashboard)
3. Upload your app
4. Pay the developer's signup fee

_Full official tutorial available [here](https://developer.chrome.com/webstore/publish)_

You can publish unlisted extension and share the direct link if you don't want to make your extension public.

##### **Final TODO:**

Show me what you've built! Contact me and let me know what extensions you've created!

Workshop/tutorial by **Trouni Tiet**\
[LinkedIn](https://linkedin.com/trouni) | [GitHub](https://github.com/trouni)\
\
Updated to Manifest Versiosn 3 by **Ryuichiro Suzuki**\
[LinkedIn](https://www.linkedin.com/in/suzukiryuichiro/) | [GitHub](https://github.com/SuzukiRyuichiro)\
\
_Created for [Le Wagon Tokyo](https://www.lewagon.com/tokyo)_
