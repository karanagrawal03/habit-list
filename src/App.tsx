import "./App.css";
import { Provider } from "react-redux";
import store from "./store/store";
import AddhabitForm from "./components/AddHabitForm/AddhabitForm";
const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <header className="App-header"></header>
        <AddhabitForm />
      </Provider>
    </div>
  );
};

export default App;
