import { States, StateMap } from 'src/constants'

class State {
  static variable: string
  public setState = (key: States, value: string) => {}
}

const state = new State()
state.setState(States.CERTIFICATE_BASE64, 'Hello')
