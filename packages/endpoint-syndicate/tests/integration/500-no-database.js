import process from "node:process";
import test from "ava";
import mockSession from "mock-session";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Returns 500 if no database configured", async (t) => {
  // Create post
  nock("https://tokens.indieauth.com").get("/token").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "create update",
  });
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar"))
    .twice()
    .reply(200);

  // Create post
  const request = await testServer({ useDatabase: false });
  const cookie = mockSession("test", process.env.TEST_SESSION_SECRET, {
    token: process.env.TEST_BEARER_TOKEN,
  });
  await request
    .post("/micropub")
    .auth(process.env.TEST_BEARER_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .set("Cookie", [cookie])
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");

  // Syndicate post
  const result = await request
    .post("/syndicate")
    .set("Accept", "application/json")
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`)
    .query(`token=${process.env.TEST_BEARER_TOKEN}`);

  // Assertions
  t.is(result.statusCode, 500);
  t.regex(result.body.error_description, /This feature requires a database/);
});
