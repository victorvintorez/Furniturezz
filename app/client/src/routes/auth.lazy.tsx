import { createLazyFileRoute } from '@tanstack/react-router'

const Index = () => {
    return (
        <div>
            <h1>/auth</h1>
        </div>
    )
}

export const Route = createLazyFileRoute('/auth')({
  component: Index,
})
