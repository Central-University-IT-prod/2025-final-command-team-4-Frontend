import { CoworkingElementResponse } from '@/shared/api/generated';
import { create } from 'zustand';

interface ICoworkStore {
  coworks: CoworkingElementResponse[];
  setCoworks(coworks: CoworkingElementResponse[]): void;
}

export const useCoworkStore = create<ICoworkStore>((set, get) => ({
  coworks: [],
  setCoworks: coworks => set({ coworks })
}));
