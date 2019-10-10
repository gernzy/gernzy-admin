import { createLocalVue as createVue } from "@vue/test-utils"
import Vuex from "vuex"
import schemaDefinitions from "./definitions.graphql.js"
import schema from "./schema.graphql.js"
import { mockServer } from "graphql-tools"
import createGernzyService from '../../src/plugins/gernzy'

export const createMockServer = () => {
  return mockServer(schemaDefinitions + schema)
}

export const createLocalVue = () => {
  const localVue = createVue()
  const GernzyService = createGernzyService(createMockServer());
  localVue.use(Vuex)
  localVue.use(GernzyService)
  return localVue
}
