import { useContext } from 'react';
import { AppContext } from './context';

export const useApp = () => {
    return useContext(AppContext);
}