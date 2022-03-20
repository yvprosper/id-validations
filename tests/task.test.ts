import chai from "chai";
import { describe, it, before, beforeEach } from "mocha";
import chaiHttp from "chai-http";
import Application from "../src/app/Application";
import container from "../src/container";
import Dummy from "../src/infra/database/models/mongoose/Dummy";

const app = new Application(container.cradle);
chai.use(chaiHttp);

const { expect, request } = chai;
const { config } = container.cradle;
const PORT = config.get("app.httpPort");
const host = `http://127.0.0.1:${PORT}`;
// const should = chai.should();

describe("Index Test", () => {
  before(async () => {
    await app.start();
  });

  describe("check test files is called", () => {
    it("should always pass", () => {
      expect(true).to.equal(true);
    });
  });

  describe("Check Endpoints", () => {
    beforeEach(async () => {
      try {
        await Dummy.deleteMany({});
      } catch (err) {
        console.log(JSON.stringify(err));
      }
    });

    it("should return validation error", async () => {
      const payload = {};
      const res = await request(host).post("/v1/todos").send(payload);
      expect(res.status).to.equal(400);
    });

    it("should create a todo", async () => {
      const payload = {
        firstName: "Jasmine",
        lastName: "Lee",
        email: "lee.jasmine@test.com",
      };
      const res = await request(host).post("/v1/todos").send(payload);
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an("object");
      expect(res.body.data.id).to.be.a("string");
      expect(res.body.data).to.have.property("firstName");
      expect(res.body.data).to.have.property("lastName");
      expect(res.body.data).to.have.property("email");
    });

    it("should get an empty object", async () => {
      const res = await request(host).get("/v1/todos");
      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an("array");
      expect(res.body.data.length).to.be.eql(0);
    });
  });
});
