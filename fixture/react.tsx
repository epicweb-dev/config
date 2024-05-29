import { useState } from 'react'

export function Counter() {
	const [count, setCount] = useState(0)
	const increment = () => setCount(c => c + 1)
	return <button onClick={increment}>{count}</button>
}
