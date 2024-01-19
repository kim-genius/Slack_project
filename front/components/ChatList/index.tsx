// import Chat from '@components/Chat';
import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM, IChat } from '@typings/db';
import React, { FC,useCallback, forwardRef, RefObject, MutableRefObject, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSections:{[key:string]:IDM[]}
  // chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean; 
  chatData?:IDM[]
  isEmpty : boolean
}
const ChatList = forwardRef<Scrollbars,Props>(({chatSections,isReachingEnd,isEmpty,setSize},ref)=> {

  const onScroll = useCallback(
    (values:any) => {
          if(values.scrollTop === 0 && !isReachingEnd ){
            console.log('가장 위')
            setSize((prevSize:number)=>prevSize +1)
            .then(()=>{
              
            })
          }
    },
    [],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
             
      </Scrollbars>

    </ChatZone>
  );
});

export default ChatList;