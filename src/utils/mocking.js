import { faker } from "@faker-js/faker";
import { createHash } from "./index.js";

export const generateMockUser = async () => {
  const hashedPassword = await createHash("coder123");
  const roles = ["user", "admin"];
  const randomRole = roles[Math.floor(Math.random() * roles.length)];

  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: randomRole,
    pets: [],
  };
};

export const generateMockUsers = async (count = 50) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const user = await generateMockUser();
    users.push(user);
  }

  return users;
};

export const generateMockPet = () => {
  const species = ["dog", "cat", "rabbit", "hamster", "bird", "fish"];
  const randomSpecie = species[Math.floor(Math.random() * species.length)];

  const petNames = [
    "Max",
    "Buddy",
    "Charlie",
    "Lucy",
    "Cooper",
    "Luna",
    "Daisy",
    "Milo",
    "Bella",
    "Rocky",
    "Molly",
    "Jack",
    "Sophie",
    "Toby",
    "Sadie",
  ];
  const randomName = petNames[Math.floor(Math.random() * petNames.length)];

  return {
    name: randomName,
    specie: randomSpecie,
    birthDate: faker.date.past({ years: 10 }),
    adopted: false,
    image: faker.image.url({ category: "animals" }),
  };
};

export const generateMockPets = (count = 1) => {
  const pets = [];

  for (let i = 0; i < count; i++) {
    const pet = generateMockPet();
    pets.push(pet);
  }

  return pets;
};
