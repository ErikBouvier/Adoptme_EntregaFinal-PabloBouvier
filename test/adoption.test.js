import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";

// Estas pruebas no depende de la aplicación completa, solo del router de adopciones
import express from "express";
import cookieParser from "cookie-parser";
import adoptionsRouter from "../src/routes/adoption.router.js";
import usersRouter from "../src/routes/users.router.js";
import petsRouter from "../src/routes/pets.router.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);

const requester = supertest(app);

describe("Adoption Router Tests", function () {
  this.timeout(10000);

  let testUserId;
  let testPetId;
  let testAdoptionId;

  before(async function () {
    try {
      await mongoose.connect("mongodb://localhost:27017/adoptme_test");
      console.log("Conectado a la base de datos de test");
    } catch (error) {
      console.error("Error conectando a la base de datos:", error);
      throw error;
    }
  });

  after(async function () {
    try {
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
      console.log("Base de datos limpiada y conexión cerrada");
    } catch (error) {
      console.error("Error limpiando la base de datos:", error);
    }
  });

  beforeEach(async function () {
    try {
      await mongoose.connection.db.collection("users").deleteMany({});
      await mongoose.connection.db.collection("pets").deleteMany({});
      await mongoose.connection.db.collection("adoptions").deleteMany({});

      const userResponse = await mongoose.connection.db
        .collection("users")
        .insertOne({
          first_name: "Juan",
          last_name: "Pérez",
          email: "juan.perez@test.com",
          password: "password123",
          role: "user",
          pets: [],
        });
      testUserId = userResponse.insertedId.toString();

      const petResponse = await mongoose.connection.db
        .collection("pets")
        .insertOne({
          name: "Firulais",
          specie: "dog",
          birthDate: new Date("2020-01-01"),
          adopted: false,
          image: "firulais.jpg",
        });
      testPetId = petResponse.insertedId.toString();
    } catch (error) {
      console.error("Error en setup:", error);
      throw error;
    }
  });

  describe("GET /api/adoptions", function () {
    it("Debería obtener todas las adopciones - lista vacía", async function () {
      const response = await requester.get("/api/adoptions");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("array");
      expect(response.body.payload).to.have.lengthOf(0);
    });

    it("Debería obtener todas las adopciones con datos", async function () {
      const adoptionResponse = await mongoose.connection.db
        .collection("adoptions")
        .insertOne({
          owner: new mongoose.Types.ObjectId(testUserId),
          pet: new mongoose.Types.ObjectId(testPetId),
        });

      const response = await requester.get("/api/adoptions");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.be.an("array");
      expect(response.body.payload).to.have.lengthOf(1);
      expect(response.body.payload[0]).to.have.property("_id");
      expect(response.body.payload[0]).to.have.property("owner");
      expect(response.body.payload[0]).to.have.property("pet");
    });
  });

  describe("GET /api/adoptions/:aid", function () {
    it("Debería obtener una adopción por ID", async function () {
      const adoptionResponse = await mongoose.connection.db
        .collection("adoptions")
        .insertOne({
          owner: new mongoose.Types.ObjectId(testUserId),
          pet: new mongoose.Types.ObjectId(testPetId),
        });
      testAdoptionId = adoptionResponse.insertedId.toString();

      const response = await requester.get(`/api/adoptions/${testAdoptionId}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("payload");
      expect(response.body.payload).to.have.property("_id");
      expect(response.body.payload).to.have.property("owner");
      expect(response.body.payload).to.have.property("pet");
    });

    it("Debería devolver error 404 para adopción inexistente", async function () {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await requester.get(`/api/adoptions/${fakeId}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("status", "error");
      expect(response.body).to.have.property("error", "Adoption not found");
    });

    it("Debería manejar ID inválido", async function () {
      const response = await requester.get("/api/adoptions/invalid-id");

      expect(response.status).to.be.oneOf([404, 500]);
      expect(response.body).to.have.property("status", "error");
    });
  });

  describe("POST /api/adoptions/:uid/:pid", function () {
    it("Debería crear una adopción exitosamente", async function () {
      const response = await requester.post(
        `/api/adoptions/${testUserId}/${testPetId}`
      );

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("status", "success");
      expect(response.body).to.have.property("message", "Pet adopted");

      const updatedPet = await mongoose.connection.db
        .collection("pets")
        .findOne({
          _id: new mongoose.Types.ObjectId(testPetId),
        });
      expect(updatedPet.adopted).to.be.true;
      expect(updatedPet.owner.toString()).to.equal(testUserId);

      const updatedUser = await mongoose.connection.db
        .collection("users")
        .findOne({
          _id: new mongoose.Types.ObjectId(testUserId),
        });
      expect(updatedUser.pets).to.have.lengthOf(1);
      expect(updatedUser.pets[0]._id.toString()).to.equal(testPetId);

      const adoption = await mongoose.connection.db
        .collection("adoptions")
        .findOne({
          owner: new mongoose.Types.ObjectId(testUserId),
          pet: new mongoose.Types.ObjectId(testPetId),
        });
      expect(adoption).to.not.be.null;
    });

    it("Debería devolver error 404 para usuario inexistente", async function () {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const response = await requester.post(
        `/api/adoptions/${fakeUserId}/${testPetId}`
      );

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("status", "error");
      expect(response.body).to.have.property("error", "user Not found");
    });

    it("Debería devolver error 404 para mascota inexistente", async function () {
      const fakePetId = new mongoose.Types.ObjectId().toString();
      const response = await requester.post(
        `/api/adoptions/${testUserId}/${fakePetId}`
      );

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("status", "error");
      expect(response.body).to.have.property("error", "Pet not found");
    });

    it("Debería devolver error 400 para mascota ya adoptada", async function () {
      await mongoose.connection.db.collection("pets").updateOne(
        { _id: new mongoose.Types.ObjectId(testPetId) },
        {
          $set: {
            adopted: true,
            owner: new mongoose.Types.ObjectId(testUserId),
          },
        }
      );

      const response = await requester.post(
        `/api/adoptions/${testUserId}/${testPetId}`
      );

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("status", "error");
      expect(response.body).to.have.property("error", "Pet is already adopted");
    });

    it("Debería manejar IDs inválidos", async function () {
      const response = await requester.post(
        "/api/adoptions/invalid-uid/invalid-pid"
      );

      expect(response.status).to.be.oneOf([404, 500]);
      expect(response.body).to.have.property("status", "error");
    });
  });

  describe("Casos edge adicionales", function () {
    it("Debería permitir múltiples adopciones por el mismo usuario", async function () {
      const pet2Response = await mongoose.connection.db
        .collection("pets")
        .insertOne({
          name: "Miau",
          specie: "cat",
          birthDate: new Date("2021-01-01"),
          adopted: false,
          image: "miau.jpg",
        });
      const testPet2Id = pet2Response.insertedId.toString();

      const response1 = await requester.post(
        `/api/adoptions/${testUserId}/${testPetId}`
      );
      expect(response1.status).to.equal(200);

      const response2 = await requester.post(
        `/api/adoptions/${testUserId}/${testPet2Id}`
      );
      expect(response2.status).to.equal(200);

      const updatedUser = await mongoose.connection.db
        .collection("users")
        .findOne({
          _id: new mongoose.Types.ObjectId(testUserId),
        });
      expect(updatedUser.pets).to.have.lengthOf(2);
    });

    it("Debería crear registros de adopción únicos para cada adopción", async function () {
      const user2Response = await mongoose.connection.db
        .collection("users")
        .insertOne({
          first_name: "Ana",
          last_name: "García",
          email: "ana.garcia@test.com",
          password: "password123",
          role: "user",
          pets: [],
        });
      const testUser2Id = user2Response.insertedId.toString();

      const pet2Response = await mongoose.connection.db
        .collection("pets")
        .insertOne({
          name: "Rex",
          specie: "dog",
          birthDate: new Date("2019-01-01"),
          adopted: false,
          image: "rex.jpg",
        });
      const testPet2Id = pet2Response.insertedId.toString();

      await requester.post(`/api/adoptions/${testUserId}/${testPetId}`);
      await requester.post(`/api/adoptions/${testUser2Id}/${testPet2Id}`);

      const adoptions = await mongoose.connection.db
        .collection("adoptions")
        .find({})
        .toArray();
      expect(adoptions).to.have.lengthOf(2);

      const response = await requester.get("/api/adoptions");
      expect(response.body.payload).to.have.lengthOf(2);
    });
  });
});
