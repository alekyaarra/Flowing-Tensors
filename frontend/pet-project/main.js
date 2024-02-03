//! Global vars
const max_inactive_time = 8000;

const animation_durations = {
  "angry": 1100,
  "idle": 800,
  "walk": 800,
  "no": 700,
  "yes": 900,
  "prance": 1100,
  "sleep": 1000,
  "bark": 600,
}
const animation_path = "./assets/";


//! Helper function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function get_gif(name){
  return animation_path + name + ".gif";
}


//! Pet vars
const pet = {
  "img": document.createElement("img"),
  "current": "idle",
  "duration": animation_durations["idle"],
  "pos": 0,
  "active": false,
  "autoDuration": 0,
  "autoMode": "random_walk",
};

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
  await delay(1000);
  await walk_pet(random_pos);
}

//! SLEEP ANIMATION
async function sleep_pet(){

}


//! ANIMATION CONTROLLER

async function auto_animation_controller(){
  const autoModes = [random_walk];

  while(true){
    if(pet.active){
      if(pet.pos != 0){
        await walk_pet(0);
        continue;
      }

      await delay(500);
      continue;
    }

    if(pet.autoDuration <= 0){
      // select random duration for auto mode
      pet.autoDuration = Math.ceil(Math.random() * 8);
      // select Random auto mode
      let randomMode = Math.floor(Math.random() * autoModes.length);
      pet.autoMode = autoModes[randomMode];
      console.log(`Mode: ${pet.autoMode}`);
    }
    else{
      await pet.autoMode();
      pet.autoDuration -= 1;
    }
    console.log("waiting");
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

  setTimeout(() => {
    console.log("Activating");
    pet.active = true;
  }, 8000);

  setTimeout(() => {
    console.log("Inactivating");
    pet.active = false;
  }, 16000);

  // sleep timer
  // pet_watcher();
}


//! MAIN
function main(){
  // Animation loop 
  main_pet_animation();

}
main();




