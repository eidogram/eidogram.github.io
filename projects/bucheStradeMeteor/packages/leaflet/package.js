Package.describe({
  summary: "Leaflet.js, mobile-friendly interactive maps. Read https://github.com/bevanhunt/meteor-leaflet for installation instructions."
});

Package.on_use(function (api, where) {
  api.add_files('lib/leaflet.js', 'client');
  api.add_files('styles/leaflet.css', 'client');
  api.add_files('images/layers.png', 'client');
  //api.add_files('images/marker-icon.png', 'client');
  //api.add_files('images/marker-icon-violet.png', 'client');
  api.add_files('images/icoon.svg', 'client');
  api.add_files('images/choice1.svg', 'client');
  api.add_files('images/choice2.svg', 'client');
  api.add_files('images/choice3.svg', 'client');
  api.add_files('images/tmp.svg', 'client');
  //api.add_files('images/icoon4.svg', 'client');
  //api.add_files('images/icoon5.svg', 'client');
  //api.add_files('images/marker-shadow.png', 'client');
  api.add_files('images/zoom-in.png', 'client');
  api.add_files('images/zoom-out.png', 'client');
});