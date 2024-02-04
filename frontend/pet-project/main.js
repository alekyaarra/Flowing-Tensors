//! Global vars
const animation_durations = {
  "angry": 1100,
  "idle": 800,
  "walk": 800,
  "no": 700,
  "yes": 900,
  "prance": 1100,
  "sleep": 800,
  "bark": 600,
}
const animation_path = "./assets/";


//! Helper function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function get_gif(name){
  return animation_path + name + ".gif";
}

const dev_header = document.getElementById("dev-header");


//! Float Emotes
function create_emote(className, source){
  let emote = document.createElement("img");
  emote.classList.add("emote");
  emote.classList.add(className);
  emote.src = source;
  return emote;
}

function emote_pet(happy = true){
  if (happy){
    console.log("WORKING");
    let emotes = [
      create_emote("float-up", animation_path + "happy_emote.png"),
      create_emote("float-up", animation_path + "happy_emote.png"),
      create_emote("float-up", animation_path + "happy_emote.png")
    ]
    for (let i = 0; i < 3; i++){
      document.getElementById("emote-container").appendChild(emotes[i]);

      const randX = Math.ceil(Math.random() * 200) - 20
      const randY = -1 * Math.ceil(Math.random() * 50)
      emotes[i].style.left = `${randX}px`;
      emotes[i].style.top = `${randY}px`;

      setTimeout(() => {
        document.getElementById("emote-container").removeChild(emotes[i])
      }, 2000)
    }
  }
}


//! Pet vars
const pet = {
  "img": document.createElement("img"),
  "current": "idle",
  "duration": animation_durations["idle"],
  "pos": 0,
  "active": false,
  "bark": false,
  "autoDuration": 0,
  "autoMode": "none",
};

pet.img.id = "pet";
pet.img.src = get_gif(pet.current);
pet.img.style.width = "160px";

const pet_container = document.getElementById("pet-container");
pet_container.appendChild(pet.img);


//! PET SEMAPHORE METHODS
function animate_pet(name){
  if (name == "sleep"){
    console.error("Call sleep_pet() instead");
    return;
  }

  pet.img.src = get_gif(name);
  pet.current = name;
  pet.duration = animation_durations[pet.current];

  dev_header.innerHTML = name;
}


//! WALK ANIMATION
async function walk_pet(new_pos = 400, idle = true){
  let distance = new_pos - pet.pos;
  if( distance == 0){
    return;
  }

  let direction = Math.sign(distance);
  let walk_duration = Math.abs(distance) * 8;

  pet.img.style.transform = `scaleX(${direction})`;

  animate_pet("walk");
  await delay(50);
  pet.img.animate(
    {
      translate : `${new_pos}px`,
      easing: "linear",
    },
    {"duration": walk_duration, "fill": "forwards"}
  );

  // Hold other animations until walk is complete
  return new Promise(resolve => {
    setTimeout(async () => {
      if (idle) {
        animate_pet("idle");
      }
      pet.pos = new_pos;
      resolve();
    }, walk_duration);
  })
}

//? INTRO WALK
async function intro_walk(){
  await walk_pet(200);
  await delay(1000);
  await walk_pet(-200);
  await delay(1000);
  await walk_pet(0);
}

//? RANDOM WALK
async function random_walk(){
  let random_pos = Math.ceil(Math.random() * 800) - 400
  await walk_pet(random_pos);
  await delay(1000);
}

//? IDLE ANIMATION
async function idle_pet(){
  if(pet.pos != 0){
    await walk_pet(0);
  }
  else{
    animate_pet("idle");
  }
}


//! SLEEP ANIMATION
async function sleep_pet(){
  if (pet.pos != 0){
    await walk_pet(0);
    return;
  }

  if(pet.current == "sleep"){
    await delay(1500);
    return;
  }

  pet.img.src = get_gif("sleep");
  pet.duration = animation_durations["sleep"];
  pet.current = "sleep";
  await delay(pet.duration);
  pet.img.src = animation_path + "sleeping.png";

  dev_header.innerHTML = "sleep";
}

//! BARK ANIMATION
async function bark_pet(){
  if(pet.bark){
    return new Promise( resolve => {
      animate_pet("bark");
      resolve();
    })
  }
  else{
    await idle_pet();
  }
}


//! ANIMATION CONTROLLER

//? INACTIVE ANIMATION CONTROLLER
async function inactive_animation_controller(){
  const autoModes = [random_walk, sleep_pet];
  // console.log(pet.autoMode.name, pet.autoDuration);
  
  if(pet.autoDuration <= 0){
    // select random duration for auto mode
    pet.autoDuration = Math.ceil(Math.random() * 2) + 2;
    // select Random auto mode
    let randomMode = Math.floor(Math.random() * autoModes.length);
    pet.autoMode = autoModes[randomMode];
  }
  else{
    await pet.autoMode();
    pet.autoDuration -= 1;
  }
}

//? ACTIVE ANIMATION CONTROLLER
async function active_animation_controller(){
  // console.log("Active");
  await bark_pet();
  await delay(500);
}

//? AUTO ANIMATION CONTROLLER ( MAIN CONTROLLER )
async function auto_animation_controller(){
  while(true){
    if(pet.active){
      await active_animation_controller();
    }
    else{
      await inactive_animation_controller();
    }
  }

  // while(pet.active){
  //   await delay(500);
  // }

  // auto_animation_controller();
}



//! ASYNC PET ANIMATIONS
async function run_async_pet(){
  // await intro_walk();
  // console.log("Intro");
  await auto_animation_controller();
}

function main_pet_animation(){
  // pet animations
  run_async_pet();

  // setTimeout(() => {
  //   console.log("Activating");
  //   pet.active = true;
  // }, 8000);

  // setTimeout(() => {
  //   console.log("Inactivating");
  //   pet.active = false;
  // }, 16000);

  // sleep timer
  // pet_watcher();
}


//! MAIN
function main(){
  // Animation loop 
  main_pet_animation();

}
main();

// window.addEventListener("mousedown", () => {
//   pet.active = true;
// })
// window.addEventListener("mouseup", () => {
//   pet.active = false;
// })



//! MISC / SERVER STUFF
const mic_button = document.getElementById("mic-button");
let mic_start = false;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;

function speech_to_text(){
  recognition.lang = 'en-US'; // Set language code as needed

  recognition.onstart = () => {
    console.log('Speech recognition started...');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    // document.getElementById('outputText').innerText = transcript;
    console.log(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended...');
  };

  recognition.start();
}



mic_button.addEventListener("click", (e) => {
    //Toggle
    mic_button.classList.toggle("active");
    mic_start = !mic_start;

    if(mic_start){
        console.log("Started Recording...");
        pet.active = true;

        speech_to_text();
    }
    else{
        console.log("Stopped Recording...");
        pet.active = false;

        recognition.stop();
    }
})





