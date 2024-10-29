import { createLazyFileRoute } from "@tanstack/react-router";

const Index = () => {
    return (
        <div>
            <h1>Index</h1>
        </div>
    )
}

export const Route = createLazyFileRoute('/')({
    component: Index,
})