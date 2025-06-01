import "./globals.css";
import "./styles/ButtonUI.css";
import { jetbrains, firacode } from "./utils/fonts";
import { Toaster } from "react-hot-toast";


export const metadata = {
  title: "Live Editor",
  description: "Authored by Levyathan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${jetbrains.className} antialiased bg-gradient-to-r from-violet-100 to-violet-300`}
      >
        {children}
        <Toaster 
          position="top-right" 
          reverseOrder={false} 
          toastOptions={{
            duration: 4000, 
            ariaProps: {
              role: 'status',
              'aria-live': 'polite',
            },
            style: {
              background: '#333',
              color: '#fff',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '12px',
            },
            className: '',
          }}
          />
      </body>
    </html>
  );
}
