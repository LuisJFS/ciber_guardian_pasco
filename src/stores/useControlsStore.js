import { create } from 'zustand'

export const useControlsStore = create((set) => ({
  forward: false,
  backward: false,
  leftward: false,
  rightward: false,
  jump: false,

  setControl: (name, value) => set({ [name]: value }),
  reset: () =>
    set({
      forward: false,
      backward: false,
      leftward: false,
      rightward: false,
      jump: false,
    }),
}))
