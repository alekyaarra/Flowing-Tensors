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
  "random_walk": false,
  "sleep": false,
  "inactive_time": 0,
};

pet.img.src = get_gif(pet.current);
pet.img.style.width = "160px";

const pet_container = document.getElementById("pet-container");
pet_container.appendChild(pet.img);


//! ANIMATION QUEUE
const animationQueue = [];

function enqueueAnimation(animationFunction, ...args) {
  return new Promise(resolve => {
    animationQueue.push({ animationFunction, args, resolve });
    if (animationQueue.length === 1) {
      executeNextAnimation();
    }
  });
}

async function executeNextAnimation() {
  if (animationQueue.length > 0) {
    const { animationFunction, args, resolve } = animationQueue[0];
    try {
      await animationFunction(...args);
      resolve(); // Resolve the promise when the animation is complete
    } catch (error) {
      console.error(`Error in animation: ${error}`);
    } finally {
      // Remove the completed animation from the queue
      animationQueue.shift();
      // Execute the next animation in the queue
      executeNextAnimation();
    }
  }
}

async function dequeueAnimation() {
  if (animationQueue.length > 0) {
    const { resolve } = animationQueue.shift();
    resolve(); // Resolve the promise associated with the dequeued animation
  }
}

async function dequeueAllAnimations() {
  while (animationQueue.length > 0) {
    await dequeueAnimation();
  }
}


//! PET SEMAPHORE METHODS
function animate_pet(name){
  //! NEVER USE DURING SLEEP ANIMATION
  if (name == "sleep"){
    console.error("Call sleep_pet() instead");
    return;
  }
  if (pet.sleep){
    return;
  }

  pet.img.src = get_gif(name);
  pet.current = name;
  pet.duration = animation_durations[pet.current];
}


//! WALK ANIMATION
async function walk_pet(new_pos = 400){
  if (pet.sleep){
    return;
  }

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
      if (!pet.sleep) {
        animate_pet("idle");
      }
      pet.pos = new_pos;
      resolve();
    }, walk_duration);
  })
}

//? INTRO WALK
async function intro_walk(){
  await enqueueAnimation(walk_pet, 200);
  await enqueueAnimation(delay, 1000);
  await enqueueAnimation(walk_pet, -200);
  await enqueueAnimation(delay, 1000);
  await enqueueAnimation(walk_pet, 0);
}

//? RANDOM WALK
async function random_walk(){
  while (pet.random_walk){
    let random_pos = Math.ceil(Math.random() * 800) - 400
    // console.log(random_pos);
    // await delay(1000);
    // await walk_pet(random_pos);
    await enqueueAnimation(delay, 1000);
    await enqueueAnimation(walk_pet, random_pos);
  }
  await enqueueAnimation(walk_pet, 0);
}

//! SLEEP ANIMATION
async function sleep_pet_animation(){
  await dequeueAllAnimations();
  
  pet.img.src = get_gif("sleep");
  pet.duration = animation_durations["sleep"];
  await enqueueAnimation(delay, pet.duration);

  pet.img.src = animation_path + "sleeping.png";
}

function sleep_pet(){
  pet.current = "sleep";
  
  pet.random_walk = false;
  pet.sleep = true;
  
  pet.inactive_time = 0;
  console.log("PET HAS SLEPT");

  sleep_pet_animation();
}

function wake_up_pet(){
  pet.sleep = false;
  pet.random_walk = true;

  pet.inactive_time = 0;
  
  random_walk();
  console.log("PET HAS WOKEN UP");
}

async function pet_watcher(){
  setInterval(async () => {
    if (!pet.sleep){
      pet.inactive_time += 100;
    }
    if (pet.inactive_time > max_inactive_time){
      await enqueueAnimation(walk_pet, 0);
      sleep_pet();
    }
  }, 100)
}

function dev_timer(){
  setInterval(() => {
    console.log(animationQueue);
  }, 100);
}





//! ASYNC PET ANIMATIONS
async function run_async_pet(){
  // await random_walk();
  await intro_walk();
  console.log("Intro");
}

function main_pet_animation(){
  // pet animations
  run_async_pet();
  // dev_timer();

  // sleep timer
  // pet_watcher();

  setTimeout(() => {
    sleep_pet();
  }, 10000);
  
  setTimeout(() => {
    wake_up_pet();
  }, 12000)


  setTimeout(() => {
    sleep_pet();
  }, 15000);

}


//! MAIN
function main(){
  // Animation loop 
  main_pet_animation();

}
main();




