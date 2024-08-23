import GridLayout from "@/layouts/GridLayout"
import useGetData from "@/hooks/useGetData"
import { Error } from "@/components/Error"
import { CardSkeleton } from "@/components/Skeletons"
import { Card } from "react-daisyui"

const Dashboard = () => {

  const { data: counts, error, isLoading, refetch } = useGetData("/dashboard/all-count-data") 

  if (isLoading){
    return (
      <>
        <GridLayout className={"grid-cols-2 lg:grid-cols-6"}>
          {Array(5).fill(0).map((_,i) => (
            <CardSkeleton key={i} className={`${i <= 2 ? 'lg:col-span-2' : "lg:col-span-3"}`}  />
          ))}
        </GridLayout>
      </>
    )
  }

  if (error) return <Error message={error} refetch={refetch}/>

  return (
    <GridLayout className={"grid-cols-2 lg:grid-cols-6"}>
      {counts.map((item, i) => (
        <Card key={i} className={`${i <= 2 ? 'lg:col-span-2' : "lg:col-span-3"} dark:bg-primary dark:text-primary-content`}>
          <Card.Body>
            <span className="text-5xl font-bold text-right">{item.num_of_data}</span>
            <h1 className="capitalize font-semibold">number of {item.name}</h1>
          </Card.Body>
        </Card>
      ))}
    </GridLayout>
  )
}

export default Dashboard