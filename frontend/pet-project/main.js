//! Global vars
const max_awake_time = 8000;

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
  "random_walk": false,
  "sleep": false,
  "awake_time": 0,
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
  while (pet.random_walk){
    let random_pos = Math.ceil(Math.random() * 800) - 400
    // console.log(random_pos);
    await delay(1000);
    await walk_pet(random_pos);
  }
}

//! SLEEP ANIMATION
async function sleep_pet(){
  console.log("SLEPT");
  await delay(1000);
  pet.awake_time = 0;
  return;
}

async function pet_watcher(){
  const awake_interval = setInterval(async () => {
    pet.awake_time += 100
    if (pet.awake_time > max_awake_time){
      clearInterval(awake_interval);
      await sleep_pet();
      pet_watcher();
    }
  }, 100);
}




//! ASYNC PET ANIMATIONS
async function run_async_pet(){
  // await random_walk();
  await intro_walk();
  console.log("Walked");
}

function main_pet_animation(){
  run_async_pet();
  pet_watcher();

}


//! MAIN
function main(){
  // Animation loop 
  main_pet_animation();

}
main();




