"use client";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import { ChildrenType } from "../../types/component-props";
import { EmailProvider } from "@/context/useEmailContext";

const LayoutProvider = dynamic(
  () => import("@/context/useLayoutContext").then((mod) => mod.LayoutProvider),
  {
    ssr: false,
  }
);

const AppProvidersWrapper = ({ children }: ChildrenType) => {
  return (
    <>
      <Provider store={store}>
        <LayoutProvider>
          <EmailProvider>
            {children}
            <ToastContainer theme="colored" />
          </EmailProvider>
        </LayoutProvider>
      </Provider>
    </>
  );
};
export default AppProvidersWrapper;
