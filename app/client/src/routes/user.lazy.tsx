import { createLazyFileRoute } from '@tanstack/react-router'

const Index = () => {
  return (
    <div>
      <h1>/user</h1>
    </div>
  )
}

export const Route = createLazyFileRoute('/user')({
  component: Index,
})
