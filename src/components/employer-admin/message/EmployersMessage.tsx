import React from 'react'
import EmployerChatBox from './components/EmployerChatBox'
import ChatBox from '../../candidate-admin/message/components/ChatBox'

const EmployersMessage: React.FC = () => {
  return (
    <div className="h-screen flex mt-[8rem]">
    <div className="w-full overflow-y-scroll">
      <ChatBox />
    </div>
  </div>
  )
}
