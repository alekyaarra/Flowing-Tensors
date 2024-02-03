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
  let steps = 3;
  let direction = Math.sign(pet.pos - new_pos);
  // let walk_duration = animation_durations["walk"] * (steps + 1);
  let walk_duration = Math.abs(pet.pos - new_pos) * 8;
  console.log(walk_duration);

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

async function run(){
  await delay(1500);
  await walk_pet();
  await delay(1000);
  await walk_pet(200);
  console.log("Walked");
}

function main(){
  // Animation loop 
  // const animationInterval = setInterval(() => {
    
  //   // clearInterval(animationInterval);
  // }, pet.duration)

  // intro_pet();
  run();
  
}
main();




