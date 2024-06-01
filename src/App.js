import logo from './logo.svg';
import Login from './page/Login';

import './App.css';

function App() {
  const pageContainer = {
    // 'width': '100vw',
    'height' : '100vh',
    'backgroundColor' : 'skyblue',
    // 'boxsizing' : 'border-box'
    // 'minWidth' : '1000px',
  }

  return (
    <div style={pageContainer}>
      <Login />
    </div>
  );
}

export default App;
