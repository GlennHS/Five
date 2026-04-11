const defaultDecay = {
  mind: 2,
  body: 2,
  cash: 2,
  work: 2,
  bond: 2,
}

export const Settings =  {
  async setup() {
    if (localStorage.getItem('firstLaunch') === null) {
      localStorage.setItem('firstLaunch', `${Date.now()}`)
      localStorage.setItem('decayRate', JSON.stringify(defaultDecay))
    }
  }
}
