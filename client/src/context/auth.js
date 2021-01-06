import {createContext, useReducer, useContext} from "react";
import jwtDecode from "jwt-decode";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;

const token = localStorage.getItem('token');
if (!!token) {
    const decoded = jwtDecode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    if (new Date() > expiresAt) {
        localStorage.removeItem('token');
    } else {
        user = {...decoded, token};
    }

} else console.log('not token found');

const reducer = (state, action) => {
  switch (action.type) {
      case 'LOGIN': {
          localStorage.setItem('token', action.payload.token);
          return {...state, user: action.payload};
      }
      case 'LOGOUT': {
          localStorage.clear();
          return {...state, user: null};
      }
      default: {
          throw new Error(`Unknown action type: ${action.type}`);
      }
  }
};

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, {user});
    return (
        <AuthDispatchContext.Provider value={dispatch}>
            <AuthStateContext.Provider value={state}>
                {children}
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
