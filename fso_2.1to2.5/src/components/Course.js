const Header = ({course}) =>{
  return (
    <div>
      <h1>{course.name}</h1>
    </div> 
  )
}

const Parts = ({courses}) => {
  const parts = courses['parts']
  return(
    parts.map(part =>
      <li key={part.id}>
        {part.name} {part.exercises}
      </li>
    )
  )
}

const Content = ({courses}) => {
  return (
    <div>
      <Parts courses={courses} />
    </div>
  )
}

const Total = ({courses}) => {
  const parts = courses['parts']
  const total = parts.reduce((s,p) => s + p.exercises,0)
  return (
    <div>
      <p><b>Total of {total} exercises</b></p>
    </div>
  )
}

const Course = ({courses}) => {
  return(
    courses.map(course =>
      <div key={course.id}>
        <Header course={course} />
        <Content courses={course} />
        <Total courses={course} />
      </div>
    )
  )  
}

export default Course