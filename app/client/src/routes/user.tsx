import { createFileRoute } from '@tanstack/react-router'

const Index = () => {
  return (
    <div>
      <h1>/user</h1>
    </div>
  )
}

export const Route = createFileRoute('/user')({
  component: Index,
})
