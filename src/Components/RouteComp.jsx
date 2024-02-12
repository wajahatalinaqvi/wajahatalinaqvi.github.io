import React from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import About from './Pages/About';

function RouteComp() {
  return (
    <div>
     
    
          <Router basename={process.env.PUBLIC_URL}>
              <Routes>
                    <Route path="/" element={<About />} />
              </Routes>
          </Router>
      </div>
  )
}

export default RouteComp