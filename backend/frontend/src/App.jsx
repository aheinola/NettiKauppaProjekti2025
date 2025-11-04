import { useState } from 'react'
import './App.css'

function App() {

  return (
    
    <div>
      <nav>
        <div className='otsikko-ja-kategoriat'>
          <h1>NettiKauppa</h1>
          
          <div className="kategoriat">
            <h2>kategoria</h2>
            <h2>kategoria</h2>
            <h2>kategoria</h2>
            <h2>kategoria</h2>
          </div>
        </div>

        
        <input type="text" placeholder='Hae' />

        <div className='kayttaja-ja-kori'>
          <h2>Kirjaudu</h2>
          <h2>Ostoskori</h2>
        </div>
        
      </nav>
    </div>
  )
}

export default App
