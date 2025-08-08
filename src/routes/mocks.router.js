import { Router } from "express";
import { generateMockUsers, generateMockPets } from "../utils/mocking.js";
import { usersService, petsService } from "../services/index.js";

const router = Router();

router.get("/mockingusers", async (req, res) => {
  try {
    const mockUsers = await generateMockUsers(50);

    res.status(200).json({
      status: "success",
      message: "50 usuarios mock generados exitosamente",
      payload: mockUsers,
      count: mockUsers.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor al generar usuarios mock",
      details: error.message,
    });
  }
});

router.get("/mockingpets/:count?", async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;

    if (count > 100) {
      return res.status(400).json({
        status: "error",
        error: "No se pueden generar más de 100 mascotas a la vez",
      });
    }

    const mockPets = generateMockPets(count);

    res.status(200).json({
      status: "success",
      message: `${count} mascotas mock generadas exitosamente`,
      payload: mockPets,
      count: mockPets.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor al generar mascotas mock",
      details: error.message,
    });
  }
});

router.post("/generateData", async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    if (
      !Number.isInteger(users) ||
      !Number.isInteger(pets) ||
      users < 0 ||
      pets < 0
    ) {
      return res.status(400).json({
        status: "error",
        error:
          'Los parámetros "users" y "pets" deben ser números enteros positivos',
      });
    }

    if (users > 1000 || pets > 1000) {
      return res.status(400).json({
        status: "error",
        error: "No se pueden generar más de 1000 registros por tipo a la vez",
      });
    }

    const results = {
      users: { created: 0, data: [] },
      pets: { created: 0, data: [] },
    };

    if (users > 0) {
      const mockUsers = await generateMockUsers(users);

      for (const user of mockUsers) {
        try {
          const createdUser = await usersService.create(user);
          results.users.created++;
          results.users.data.push(createdUser);
        } catch (userError) {
          continue;
        }
      }
    }

    if (pets > 0) {
      const mockPets = generateMockPets(pets);

      for (const pet of mockPets) {
        try {
          const createdPet = await petsService.create(pet);
          results.pets.created++;
          results.pets.data.push(createdPet);
        } catch (petError) {
          continue;
        }
      }
    }

    res.status(201).json({
      status: "success",
      message: "Datos generados e insertados exitosamente",
      payload: {
        users: {
          requested: users,
          created: results.users.created,
          data: results.users.data,
        },
        pets: {
          requested: pets,
          created: results.pets.created,
          data: results.pets.data,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor al generar datos",
      details: error.message,
    });
  }
});

export default router;
