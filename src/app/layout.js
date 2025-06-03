import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Restaurantes do Brasil",
  description: "Encontre os melhores restaurantes por todo o Brasil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" className="m-0 p-0">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0`}>
        {children}
        <div id="modal-root"></div> 
        <footer className=" text-black py-6 mt-10">
          <div className="container mx-auto text-center">
            <p className="text-sm">
              Desenvolvido por{" "}
              <span className="font-semibold">Larissa Benvenuti</span>
            </p>
            <p className="text-xs mt-2 text-gray-400">
              © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}