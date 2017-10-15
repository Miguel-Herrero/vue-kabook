import Vue from 'vue'
import Login from '@/components/Login'

describe('Login.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Login)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('h1.title').textContent).to.equal('Kabook')
    expect(vm.$el.querySelector('h2.subtitle').textContent).to.equal('A little corner for your imagination')
    expect(vm.$el.querySelector('a.button.is-primary.is-inverted').textContent).to.equal('Login')
  })
})
