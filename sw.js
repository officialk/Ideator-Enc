self.addEventListener("push", e => {
  var data;
  try {
    data = e.data.json();
  } catch (ex) {
    data = { title: e.data.text() };
  }
  self.registration.showNotification(data.title, {
    body: "this is a test",
    icon: "images/icons/icon-512x512.png"
  });
});
self.addEventListener("fetch", e => {
  return fetch(e.request);
});
