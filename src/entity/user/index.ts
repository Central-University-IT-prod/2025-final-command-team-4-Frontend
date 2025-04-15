import { accountService, auth } from '@/shared/api';
import { AccountProfileResponse } from '@/shared/api/generated';
import { create } from 'zustand';

interface IUserStore {
  user: AccountProfileResponse | null;
  setUser(user: AccountProfileResponse | null): void;

  avatar: Blob | null;
  setAvatar(avatar: Blob | null): void;
  fetchAvatar(): Promise<void>;
}

export const useUserStore = create<IUserStore>((set, get) => ({
  user: null,
  setUser: user => set({ user }),

  avatar: null,
  setAvatar: avatar => set({ avatar }),
  async fetchAvatar() {
    const res = await accountService.downloadAvatar(
      {
        login: get().user?.login || ''
      },
      auth
    );

    set({ avatar: res });
  }
}));
