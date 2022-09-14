import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import IUser from "../interfaces/IUser";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

interface IState {
  user: IUser | null;
}

interface ILoginPayload {
  token: string;
  User: any;
}

const initialState: IUser = {
  id: "",
  userName: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: {
    name: "",
    id: "",
    abrv: "",
  },
};

//test to see if user slice is cleared properly
//refactor other components to use user from userSlice not from authSlice so they get up to date info about user
//handle user clear on logout
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser(state) {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authService.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<ILoginPayload>) => {
        const { User } = action.payload;

        state.id = User.id;
        state.userName = User.userName;
        state.firstName = User.firstName;
        state.lastName = User.lastName;
        state.email = User.email;
        state.password = User.password;
        state.role = User.Role;
        // state = {...User} DOESNT WORK FOR SOME REASON
      }
    );
    builder.addMatcher(
      userService.endpoints.getUser.matchFulfilled,
      (state, action: PayloadAction<IUser>) => {
        state = action.payload;
      }
    );
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
