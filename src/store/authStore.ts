import {   setToken ,setUserInfo} from "../sharedBase/baseServiceVar";
import { create, createJSONStorage, devtools, persist } from "../sharedBase/globalUtils";
import { UserInfo } from "../types/auth";

interface AuthStore {
  token: string | null
  userDet: UserInfo | null
  isAuthenticated: boolean
  login: (token: string) => void
  userInfo: (userDet: UserInfo) => void
  logout: () => void
  loggedInUserID: string | null
  loggedInUser: (loggedInUserID: string) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist<AuthStore>(
      (set) => ({
        token: null,
        isAuthenticated: false,
        login: (token: string) => {
          set({ token, isAuthenticated: true })
          setToken(token);
        },
        userDet:null,
        userInfo: (userDet: UserInfo) => {
          set({ userDet })
          setUserInfo(userDet)
        },
        logout: () => {
          set({ token: null, isAuthenticated: false })
          setToken("")
          setUserInfo({})
        },
        loggedInUserID: null,
        loggedInUser: (loggedInUserID: string) => {
          set({ loggedInUserID })
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        merge: (persistedState: unknown, currentState: AuthStore): AuthStore => {
          const typedState = persistedState as Partial<AuthStore> | undefined
          if (typedState?.token) {
            setToken(typedState.token)
          }
          if (typedState?.userDet) {
            setUserInfo(typedState.userDet)
          }

          return {
            ...currentState,
            ...(typedState ?? {}),
          }
        },
      },
    ),
  ),
)

