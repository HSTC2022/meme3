import {Header} from "./Header";
import React from "react";

export { Layout };
function Layout({ children }) {
    return (
      <div>
          <Header/>
          <main>
              {/* Container START */}
              {children}
          </main>
      </div>
    );
}
