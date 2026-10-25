import React,{createContext,useContext,useEffect,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
type Data={done:string[];hidden:string[];archived:string[];completed:string[];edits:Record<string,string>;added:{title:string;description:string;kind:string}[]};
const initial:Data={done:[],hidden:[],archived:[],completed:[],edits:{},added:[]};
const Context=createContext({data:initial,change:(_patch:Partial<Data>)=>{}});
export function AppProvider({children}:{children:React.ReactNode}){const [data,setData]=useState(initial);const [loaded,setLoaded]=useState(false);useEffect(()=>{AsyncStorage.getItem('icarus-v1').then(v=>{if(v)setData({...initial,...JSON.parse(v)});}).catch(()=>{}).finally(()=>setLoaded(true));},[]);useEffect(()=>{if(loaded)AsyncStorage.setItem('icarus-v1',JSON.stringify(data)).catch(()=>{});},[data,loaded]);return <Context.Provider value={{data,change:patch=>setData(d=>({...d,...patch}))}}>{loaded?children:null}</Context.Provider>;}
export const useApp=()=>useContext(Context);
