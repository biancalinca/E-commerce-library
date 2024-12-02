import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetail : (state, action) => {
        state.user = action.payload
        console.log("Detaliile user-ului", action.payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserDetail } = userSlice.actions

export default userSlice.reducer