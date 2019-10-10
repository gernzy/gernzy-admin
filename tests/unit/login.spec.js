import Vue from 'vue'
import { mount } from "@vue/test-utils"
import Login from "../../src/components/login.vue"
import createStore from "../../src/store/store"
import { createMockServer, createLocalVue } from './helper'

const localVue = createLocalVue()
const store = createStore()
const server = createMockServer()

describe("Login", () => {
  test("should render content correctly", () => {
    const wrapper = mount(Login)
    expect(wrapper.find('label[for="email"]').text()).toEqual("Email")
  })

  test('can handle successful login when submit button is clicked', async function( done ){
    const wrapper = mount(Login, { store, localVue, attachToDocument:true })
    const email = wrapper.find('input[type="email"]')
    const passw = wrapper.find('input[type="password"]')
    email.setValue("luke@example.com")
    passw.setValue("password")
    wrapper.find('button[type="submit"]').trigger('click')

    await Vue.nextTick()
    expect(store.state.session.has_active_session).toEqual(true)
    wrapper.destroy()
    done()
  })

  test('can handle failed login when submit button is clicked', async function( done ){
    const wrapper = mount(Login, { store, localVue, attachToDocument:true })
    const email = wrapper.find('input[type="email"]')
    const passw = wrapper.find('input[type="password"]')
    email.setValue("")
    passw.setValue("")
    wrapper.find('button[type="submit"]').trigger('click')

    await Vue.nextTick()
    expect(store.state.session.has_active_session).toEqual(false)
    wrapper.destroy()
    done()
  })

})
