import { createSlice, } from "@reduxjs/toolkit";
//for previous chat history list

// this list will be like following

// listedChats={
//     email:email,
//     allChatHeading:[
//         {
//             chat:Heading,
//             date:date.now,
//         },
//         {
//             chat:Heading,
//             date:date.now,
//         }
//     ]
// }


//for chat history
//only load chat ,which is selected,


const initialState={
    accessToken:"",
    userEmail:"",
    chatIdFromFirebase :""
}

export const chatSlice=createSlice({
    name:"chats",
    initialState,
    reducers:{
        updateAccessToken:(state,action)=>{
            state.accessToken=action.payload
        },
        updateUser:(state,action)=>{
            state.userEmail=action.payload
        }
        ,
        updateChatId:(state,action)=>{
            state.chatIdFromFirebase=action.payload;
        }

    }
})

export const {updateAccessToken,updateUser,updateChatId}=chatSlice.actions

export default chatSlice.reducer;