import React, { useEffect, useState } from 'react'
import MessageFormField from './MessageFormField'
import { HiArrowLeft } from "react-icons/hi2";
import { FaTelegramPlane } from "react-icons/fa";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import ChatMessage from './ChatMessage ';
import Message from '../../assets/chat';
import { useStateContext } from '../../miscellaneous_contexts'
import JoinBtn from './JoinBtn';
import DisjoinBtn from './DisjoinBtn';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAddress } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

function ChatView(props: any) {
    const [message,setMessage]=useState("");
    const [lOfMesage,setlom]=useState([]);
    const router=useRouter();
    const { chatToggleDrawer, setChatToggleDrawer } = useStateContext();
    const address=useAddress();
    const [messages,setMessages]=useState([]);
    useEffect(()=>{
        if(props.serverId && router.isReady){
            getDocs(collection(db,`servers/${props.serverId}/messages`)).then((snap)=>{
                const arr:JSX.Element[]=[];
                snap.forEach((doc)=>{
                    arr.push(<ChatMessage message={doc.data().Message} sender={doc.data().Sender} imageUrl={`https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg`} created_at={doc.data().timeStamp} />)
                })
                setMessages(arr);
            
            }).catch((err)=>{
                console.log(err);
            })
        }
        
    },[props.serverId,router.isReady])
    useEffect(()=>{
        if(router.isReady && props.serverId){
            const q=query(collection(db,`servers/${props.serverId}/messages`));
            const unsub=onSnapshot(q,(snapshot)=>{
                const arr=[];
                snapshot.docChanges().forEach((change)=>{
                    if(change.type==='added'){
                    arr.push(<ChatMessage message={change.doc.data().Message} sender={change.doc.data().Sender} imageUrl={`https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg`} created_at={change.doc.data().timeStamp} />)
                    }
                })
                setMessages((messages)=>[].concat(messages,arr));
              
                
            })
        }
    },[props.serverId,router.isReady])
   
    
    const handleClick =async()=>{
        addDoc(collection(db,`servers/${props.serverId}/messages`),{
            "Message":message,
            "Sender":props.username,
            "timeStamp": new Date()
        }).then(()=>{
            console.log("Sent");
            })
    }
    const CommunityMenuToggleDrawer = (value: boolean) => {
        setChatToggleDrawer(value);
    }
    return (
        <div className=' w-full h-full bg-[#2d2d39] md:rounded-r-[10px] overflow-y-scroll scrollbar-none flex flex-col justify-between'>
            <div className='w-full top-0 relative p-1 bg-[#3e3e4e] flex items-center'>
                <HiArrowLeft onClick={() => CommunityMenuToggleDrawer(!chatToggleDrawer)} className='mx-5  text-[20px] text-[#808191] md:hidden' />
                <div className=' flex justify-between w-full items-center pr-5'>
                    <div className="bg-[#3e3e4e] rounded-lg flex justify-start items-center p-2 gap-2 hover:cursor-pointer">
                        <div>
                            <img
                                className="rounded-full h-[30px] w-[30px]"
                                src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt={`Avatar of Gopal Verma`}
                            // alt={`Avatar of ${name}`}
                            />
                        </div>
                        <div>
                            <p className="text-[15px] text-[#b2b4c9] font-semibold">Gopal Verma</p>
                            {/* <p className="text-[13px] text-[#808191] font-bold">{name}</p> */}
                        </div>
                    </div>
                    <JoinBtn />
                    {/* <DisjoinBtn /> */}
                </div>
            </div>
            <div className=' flex flex-col overflow-y-scroll text-white p-3 h-full '>
                {/* {
                    Message.map(e => (
                        <ChatMessage message={e.message} sender={e.username} imageUrl={e.profilePic} created_at={e.created_at} />
                    ))
                } */}
                {messages}
            </div>
            <div className='w-full top-0 relative bg-[#3e3e4e]'>
                <form className='flex items-center mx-5'>
                    <BsFillChatLeftDotsFill className='text-[20px] text-[#666d7b] mr-2' />
                    <input
                        required
                        onChange={(e)=>{setMessage(e.target.value)}}
                        type={"text"}
                        step="0.1"
                        placeholder={"Enter The message"}
                        className="flex w-full py-[15px] sm:px-[px]  outline-none border-[1px] border-[#3E3E4E] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#676f7e] rounded-[10px] "
                    >
                    </input>
                    <FaTelegramPlane className='mx-1 text-[25px] text-[#808191] hover:cursor-pointer' onClick={handleClick} />
                </form>
            </div>
        </div>
    )
}

export default ChatView