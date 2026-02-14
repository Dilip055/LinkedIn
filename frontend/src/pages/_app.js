import { myStore } from "@/config/redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={myStore}>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </Provider>
  );
}
