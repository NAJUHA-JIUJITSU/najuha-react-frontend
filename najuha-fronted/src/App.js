import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset' // 리액트에서는 styled-reset을 통해 모든 스타일을 reset 할 수 있어요.
import {BrowserRouter, Routes, Route} from 'react-router-dom'

const GlobalStyle = createGlobalStyle`
  ${reset}`

function App() {
  return (
    <React.Fragment>
    <GlobalStyle />  
    <BrowserRouter>
      <Routes>
        <Route path = '/' element={<h1>hello</h1>} />
      </Routes>

    </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
