import './App.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResponse } from './features/response/responseSlice';

function App() {
  const dispatch = useDispatch();
  const apiResponse = useSelector((state) => state.response.apiResponse);

  const callApi = async () => {
    let res = await fetch("http://localhost:9000/test");
    res = await res.text();
    dispatch(setResponse(res));
    return res
  }

  useEffect(() => {  
    callApi();
  });

  return (
    <div id='App'>
      <h1>Todo App</h1>
      <p>{apiResponse}</p>
    </div>
  );
}

export default App;
