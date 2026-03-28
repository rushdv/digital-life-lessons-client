import { useParams } from 'react-router-dom'

const LessonDetails = () => {
  const { id } = useParams()

  return (
    <div>
      <h2>Lesson Details - {id}</h2>
    </div>
  )
}

export default LessonDetails
