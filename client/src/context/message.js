import {createContext, useReducer, useContext} from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const reducer = (state, action) => {
    let user, users, userIndex;
    const {username, message, messages} = action.payload
    switch (action.type) {
        case 'SET_USERS': {
            return {...state, users: action.payload};
        }
        case 'SET_SELECTED_USER': {
            users = state.users.map((user) => ({
                ...user,
                selected: user.username === action.payload
            }));
            return {...state, users};
        }
        case 'SET_USER_MESSAGES': {
            users = [...state.users];
            userIndex = users.findIndex((user) => user.username === username);
            users[userIndex] = {...users[userIndex], messages};
            return {...state, users};
        }
        case 'ADD_MESSAGE': {
            users = [...state.users];
            userIndex = users.findIndex((user) => user.username === username);
            user = {
                ...users[userIndex],
                messages: users[userIndex].messages
                    ? [message, ...users[userIndex].messages]
                    : null,
                latestMessage: message
            };
            users[userIndex] = user;
            return {...state, users};
        }
        default: {
            throw new Error(`Unknown action type: ${action.type}`);
        }
    }
};

export const MessageProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, {users: null});
    return (
        <MessageDispatchContext.Provider value={dispatch}>
            <MessageStateContext.Provider value={state}>
                {children}
            </MessageStateContext.Provider>
        </MessageDispatchContext.Provider>
    );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
