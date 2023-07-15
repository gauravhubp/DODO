import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator } from "@chatscope/chat-ui-kit-react"; 
import robo from "./robo.png";

const API_KEY=process.env.REACT_APP_API_KEYY;
console.log(API_KEY);

function App() {
   const [typing,setTyping] = useState(false);
  const [messages, setMessages] = useState([{
    message: "Hi, How Can I help you ?",
    sender: "ChatGPT"
  }])

   const handleSend = async (message) =>{
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

   const newMessages = [...messages,newMessage];

   setMessages(newMessages);

   setTyping(true);

   await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages){
    let apiMessages = chatMessages.map((messageObject) => {
      let role="";
      if(messageObject.sender === "ChatGPT") {
        role="assistant"
      }
      else
      {
        role = "user"
      }
      return {role: role,content: messageObject.message}
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old."
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=>{
      return data.json();
    }).then((data) => {
     setMessages(
      [...chatMessages,{
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setTyping(false);
    })
  }


//Js Design typewriter effect.
  var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

  return (
   <div class="App">
    
    <div class="chatbody" style={{height:"400px",width: "500px"}}>
      <h1 class="dodo-h1">Dodo</h1>
        <MessageList class="mbox"
        scrollBehavior='smooth'
        typingIndicator={typing ? <TypingIndicator content="Dodo is typing"/>: null}
        >
          {messages.map((message,i) => {
            return <Message key={i} model={message} />
          })}
        </MessageList>
        <MessageInput placeholder='Type message here' onSend={handleSend} />
   
    </div>
        
<section class="airs">
<h1 class="dodocall">
        <a href="" class="typewrite" data-period="2000" data-type='[ "Hi, I am Dodo.", "I am an AI Bot.", "I Love to talk.", "I can do anything.","Gaurav is my developer." ]'>
          <span class="wrap"></span>
        </a>
      </h1>
      <img src={robo} alt='robot image'/>
  <div class='air air1'></div>
  <div class='air air2'></div>
  <div class='air air3'></div>
  <div class='air air4'></div>
  </section>

   </div>
  )
}

export default App
