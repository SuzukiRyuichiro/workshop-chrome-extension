const baconify = () => {
  // TODO: Add the image replacement script here
  document.querySelectorAll("img").forEach((img) => {
    img.src = `https://baconmockup.com/${img.width}/${img.height}`;
    img.srcset = img.src;
  });
};

// TODO: Write a function to listen for messages on the content page using chrome.runtime.onMessage

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "baconify") baconify();
});
