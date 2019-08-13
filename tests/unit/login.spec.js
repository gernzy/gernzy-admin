import { mount } from "@vue/test-utils";
import { mockServer } from "graphql-tools";
import Login from "../../src/components/login.vue";
import schemaDefinitions from "./definitions.graphql.js";
import schema from "./schema.graphql.js";

const myMockServer = mockServer(schemaDefinitions + schema);

describe("Login", () => {
  test("should render content correctly", () => {
    const wrapper = mount(Login);
    expect(wrapper.find('label[for="username"]').text()).toEqual("Username");
    return myMockServer
      .query(
        `
            mutation {
                createSession {
                    token
                }
            }
        `
      )
      .then(result => {
        expect( typeof(result.data.createSession.token) ).toBe("string");
      });
  });
});
