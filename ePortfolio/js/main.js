const setting_icon = document.querySelector('#setting-icon');
const setting_panel = document.querySelector('#pref-panel');
const reset_user = document.querySelector('#user-reset');
const body = document.querySelector('body');
const sections = document.querySelectorAll('sections');
var defaultSettings = {};
//console.log(setting_icon);
// console.log(setting_panel);

//*** User-Name Setting ***/

//when the window loads, prompt the user for their user-name if one
//is not already stored.
//otherwise use their stored user-name to welcome them.
//Reset their user-name when they click on the reset button.
window.onload = function () {
  /*
       ** Username settings ** 
   */
  if (localStorage.getItem('UserName')) {
    document.querySelector('#user-name').innerText = localStorage.getItem('UserName');
  }
  else {
    setUserName();
  }
  /*
     ** User Preferences ** 
 */

  let firstSection = document.querySelector('#welcome-section');
  let sectionComputedStyles = getComputedStyle(firstSection);
  // colour controls wont take RGB values so need to convert the defaults to hex to handle this.
  defaultSettings.bgColor = RGBToHex(sectionComputedStyles.backgroundColor);
  defaultSettings.fontColor = RGBToHex(sectionComputedStyles.color);
  defaultSettings.fontSize = parseInt(sectionComputedStyles.fontSize);



  console.log("Current computed background color of the first section: " + defaultSettings.bgColor);
  console.log("Current computed font color of the first section: " + defaultSettings.fontColor);
  console.log("Current computed font size of the first section: " + defaultSettings.fontSize + "px");
  console.log(defaultSettings);

  //Save the default settings object to local storage as JSON encoded string
  //with a key of defaultSettings
  localStorage.setItem('defaultSettings', JSON.stringify(defaultSettings));



  //If user settings exist in local storage then apply them to
  //the page and use them to set the preference panel values
  if (localStorage.getItem('userSettings')) {
    let userSettings = JSON.parse(localStorage.getItem('userSettings'));

    applySettings(userSettings);
    setPrefPanelValues(userSettings);
  }
  else if (localStorage.getItem('defaultSettings')) {
    let defaults = JSON.parse(localStorage.getItem('defaultSettings'));
    setPrefPanelValues(defaults);
  }
}
reset_user.addEventListener('click', setUserName)

function setUserName() {
  let name = prompt('Please provide a username: ');
  if (name) {//if name is not null
    localStorage.setItem('UserName', name);
    document.querySelector('#user-name').innerText = localStorage.getItem('UserName');
  }
  else {
    localStorage.setItem('UserName', 'ANONYMOUS');
    document.querySelector('#user-name').innerText = localStorage.getItem('UserName');
  }
}
/*** User-preference Settings ***/

//Store the default setting.
// Show/Hide the preferences panel
setting_icon.addEventListener('click', function(){
  // console.log(setting_panel);
  if(setting_panel.style.display == 'block')
  {
      setting_panel.style.display = 'none';
  }
  else
  {
      setting_panel.style.display = 'block';
  }
});

// Store the default settings.
const cp_bg = document.querySelector('#prefs-bg-colour');
const cp_fc = document.querySelector('#prefs-font-colour');
const r_fs = document.querySelector('#prefs-font-size');

// Use Default Settings
const default_btn = document.querySelector('#prefs-default');
default_btn.addEventListener('click', function(){
  if(localStorage.defaultSettings){
      let defSet = JSON.parse(localStorage.defaultSettings)
      applySettings(defSet);
      setPrefPanelValues(defSet);
   }
});

// Apply changes as the controls are toggled
var temp_settings = null;
document.getElementById("pref-table").addEventListener('change',function(e)
  {
      var temp_settings = {};

      temp_settings.bgColor = cp_bg.value;
      temp_settings.fontColor	= cp_fc.value;
      temp_settings.fontSize = r_fs.value;
      
      document.getElementById("font-size-display").innerText = temp_settings.fontSize;

      console.log("Temp setting object is below:")
      console.log(temp_settings);

      applySettings(temp_settings);
  });


// Save user preferences
const save_btn = document.querySelector('#prefs-save');
save_btn.addEventListener('click', function(){
  var temp_settings = {};

  temp_settings.bgColor = cp_bg.value;
  temp_settings.fontColor	= cp_fc.value;
  temp_settings.fontSize = r_fs.value;

  if(temp_settings){
      localStorage.setItem('userSettings',JSON.stringify(temp_settings));
      alert("Your preferences have been saved.");
  }
  else{
      alert("NO SETTINGS HAVE BEEN SAVED\nNo settings were changed.");
  }
})

// Save the settings as a JSON encoded string to Local Storage.
// This is required so that the next time the page is loaded, it will
// use the the users preferred styling.
function saveUserPreferences(settingsObject, keyName){
  // get JSON encoded string of the settings object
  let settingsJSON = JSON.stringify(settingsObject);

  // save to LS with the key name
  localStorage.setItem(keyName, settingsJSON);
};

//Retrieve user settings from localStorage
function getPreferences(keyName){
  // if the key exists in local storage
  if (localStorage.getItem(keyName)) {
      let keyValue = localStorage.getItem(keyName)
      let obj = JSON.parse(keyValue);
      return obj;
  } else {
      console.error('The '  + keyName + ' does not exist in local storage!');
      return null;
  }
};

// function that applies the specified styles to the sections
// using thepassed in object with the following properties:
// backgroundColor - with a string value
// fontColor - with a string value
// fontSize - with a whole number value
function applySettings(settings){

  let sections = document.querySelectorAll(".main-section");
  for (let index = 0; index < sections.length; index++) {
      let currentSection = sections[index];
      currentSection.style.backgroundColor = settings.bgColor;
      currentSection.style.color = settings.fontColor;
      currentSection.style.fontSize = settings.fontSize + 'px';
 }
} // end of applySettings function definition

const cancel_btn = document.querySelector('#prefs-cancel');
cancel_btn.addEventListener('click', function(){
      if(localStorage.userSettings)
          {
              let userSettings = JSON.parse(localStorage.userSettings);
                  applySettings(userSettings);
                  setPrefPanelValues(userSettings);
          }
          else if (localStorage.default)
          {
              let defaultSettings = JSON.parse(localStorage.default);
              applySettings(defaultSettings);
              setPrefPanelValues(defaultSettings);
          }
          else
          {
              console.error("No default or user setting found");
              alert("No default or user setting found")
          }
});

//****************************************************************** */
//Function to set the pref panel input to the values in a
//setting type object
function setPrefPanelValues(settings)
{
  document.getElementById("prefs-bg-colour").value = settings.bgColor;
  document.getElementById("prefs-font-colour").value = settings.fontColor;
  document.getElementById("prefs-font-size").value = settings.fontSize;
  //Set the display font size span to the value of the range slider
  document.getElementById("font-size-display").innerText = settings.fontSize;
}

// Convert RGB or RGBA color string to color hex value
// Takes an rgb/rgba color string and returns a hex color string
// This is required to update the the colour controls with the default
// colours in the Window.onLoad event.
function RGBToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  if(rgb.includes('a')){
      rgb = rgb.substr(5).split(")")[0].split(sep);
  }
  else{
      rgb = rgb.substr(4).split(")")[0].split(sep);
  }
  let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  return "#" + r + g + b;
}
// save the settings as a JSOn encoded string to Local Storage.
//This is required so that the next time the page is loaded, it will 
//use the users preferred styling.
/*** Burger Menu  ***/
let menuIcon = document.getElementById('burger-menu');
menuIcon.addEventListener('click',function(){

    const burgerMenu = document.querySelector("#nav-links");
    if(burgerMenu){

        if (burgerMenu.style.display =="block")
        {
         burgerMenu.style.display ="none";
        }
        else
        {
         burgerMenu.style.display ="block";
        }
     }
     else
     {
         console.log("Bad stuff happened.");
     }
});

//animation
// get a reference to the element being animated
const rocket = document.querySelector('#motion-object');
const audio = new Audio('audio/explosion.wav');

// Animation start button
document.getElementById('start-btn').addEventListener('click', function () {
  rocket.classList.add("flight");
});

// Animation stop button
document.getElementById('stop-btn').addEventListener('click', function () {
  rocket.classList.remove("flight");
  audio.play(); // Play audio when animation stopped.
});

// Animation speed
document.getElementById('animation-speed').addEventListener('change', function (e) {
  let speed = e.currentTarget.value;
  document.getElementById('speed-display').innerText = speed;
  rocket.style.animationDuration = speed + 's';
});


// Gallery Slide show
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  let captionText = document.getElementById("caption");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  captionText.innerHTML = dots[slideIndex - 1].alt;
}
//map Code
document.querySelector('#find-me').addEventListener('click', geoFindMe);

function geoFindMe() {
  const status = document.querySelector('#status');
  const co_ords = document.querySelector('#co-ords');

  co_ords.textcontent = '';

  function successful(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = '';

    co_ords.innerText = `Latitude: ${latitude}° 
                                Longitude: ${longitude}°`;
  }

  function error() {
    status.textContent = 'Unable to find location.';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Goelocation is not supported';
  }
  else {
    status.textContent = 'locating.........';
    navigator.geolocation.getCurrentPosition(successful, error);
  }
}