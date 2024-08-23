import { createContext, useContext, useEffect, useState } from 'react'
import { RiCheckFill } from '@remixicon/react'
import PhoneInfoForm from '@/components/forms/PhoneInfoForm'
import PhoneSpecsForm from '@/components/forms/PhoneSpecsForm'
import { Timeline, Loading } from 'react-daisyui'
import { cn } from '@/utils/styling'

const phoneInitial = { phoneInfo: null, phoneSpecs: null}

const PhoneContext = createContext(phoneInitial)

const AddPhonePage = () => {
  
  const [currentForm, setCurrentForm] = useState("info") // info || specs
  const [phoneData, setPhoneData] = useState(phoneInitial)


  return (
    <>  
        <h1 className='my-5 text-xl font-bold'>Create New Phone Data</h1>
        <Timeline className="w-full">
          <Timeline.Item 
            connect='both' 
            startClassName='bg-primary' 
            endClassName={cn("bg-base-300", phoneData.phoneInfo && "bg-primary")} className='w-2/4'>
            <Timeline.Start className="timeline-start timeline-box">Phone Information</Timeline.Start>
            <Timeline.Middle className="timeline-middle bg-neutral text-neutral-content p-1 rounded-full m-1">
              <RiCheckFill className={cn("text-neutral-content", phoneData.phoneInfo && "text-primary")}/>
            </Timeline.Middle>
          </Timeline.Item>
          <Timeline.Item className='w-2/4'
            connect='both' 
            startClassName={cn("bg-base-300", phoneData.phoneInfo && "bg-primary")}
            endClassName={cn("bg-base-300", phoneData.phoneSpecs && "bg-primary")}>
            <Timeline.Start className="timeline-start timeline-box">Phone Specification</Timeline.Start>
            <Timeline.Middle className="timeline-middle bg-neutral text-neutral-content p-1 rounded-full m-1">
              <RiCheckFill className={cn("text-neutral-content", phoneData.phoneInfo && "text-primary")}/>
            </Timeline.Middle>
          </Timeline.Item>
        </Timeline>

        <PhoneContext.Provider value={{ phoneData, setPhoneData, setCurrentForm }}>
          <div className="p-5">
            {currentForm === "info"
              ? <PhoneInfoForm />
              : <PhoneSpecsForm />
            }
          </div>
        </PhoneContext.Provider>

    </>
  )
}

export const useCreatePhone = () => {
  const {  phoneData, setPhoneData, setCurrentForm } = useContext(PhoneContext)
  return { phoneData, setPhoneData, setCurrentForm}
}

export default AddPhonePage