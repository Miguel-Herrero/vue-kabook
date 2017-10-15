import Vue from 'vue'
import Authors from '@/components/Authors'

describe('Authors.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Authors)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('h1').textContent).to.equal('Authors')
  })
})
