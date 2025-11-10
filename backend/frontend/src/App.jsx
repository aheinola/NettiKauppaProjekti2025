import useState from 'react'
import './App.css'

function App() {
  const [password, setPassword] = useState('')


  const showProducts = () => {
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching products:', error));
  }

  return (
    <>
      <div className="card">
        <button onClick={showProducts}>
          Show Products
        </button>
        <form>
          <h2>add new user</h2>
          <input 
            type="text" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password" 
          />
          <button type="submit">Submit</button>
        </form>
      </div>
        
    </>
  )
}

export default App
