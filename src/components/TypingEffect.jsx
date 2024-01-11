import React, { useState, useEffect, useRef } from 'react';

const TypingEffect = ({ text,isUpdate }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
    const chatContainerRef=useRef(null)
    const chatscroll=()=>{
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    
        }
      }
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.substring(0, currentIndex));
        chatscroll()
        setCurrentIndex((prevIndex) => prevIndex + 1);
       
      } else {
        clearInterval(typingInterval);
      }
    }, .5); // Typing speed: 50 milliseconds
    
    return () => clearInterval(typingInterval);
  }, [text, currentIndex]);

  return (
    isUpdate?<span ref={chatContainerRef} className='whitespace-pre-wrap' dangerouslySetInnerHTML={{__html:text}}/>:
    <span ref={chatContainerRef} className=' whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: displayedText }} />
  )
};

export default TypingEffect;
