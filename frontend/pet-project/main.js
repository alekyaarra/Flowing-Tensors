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

function get_gif(name){
  return animation_path + name + ".gif";
}

// Helper function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Pet vars
const pet = {
  "img": document.createElement("img"),
  "current": "idle",
  "duration": animation_durations["idle"],
  "pos": 0,
  "random_walk": true,
};

pet.img.src = get_gif(pet.current);
pet.img.style.width = "160px";


const pet_container = document.getElementById("pet-container");
pet_container.appendChild(pet.img);


function animate_pet(name){
  if (name == "sleep"){
    return;
  }

  pet.img.src = get_gif(name);
  pet.current = name;
  pet.duration = animation_durations[pet.current];
}

function intro_pet(steps = 3, distance = 400){
  // pet.img.style.translate = `${distance}px 0`;
  

}


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

async function intro_walk(){
  await delay(2000);
  await walk_pet(400);
  await delay(1000);
  await walk_pet(200);
  await delay(1000);
  await walk_pet(-200);
  await delay(1000);
  await walk_pet(0);
}

async function random_walk(){
  while (pet.random_walk){
    let random_pos = Math.ceil(Math.random() * 800) - 400
    // console.log(random_pos);
    await delay(1000);
    await walk_pet(random_pos);
  }
}


async function run(){
  await random_walk();
  console.log("Walked");
}

function main(){
  // Animation loop 
  run();
  
}
main();




