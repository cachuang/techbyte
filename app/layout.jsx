import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/Header";

// Inter 主要給 Windows 用。font stack 把它放在 -apple-system / BlinkMacSystemFont / Roboto
// 之後 → iOS/Mac 走 SF Pro、Android 走 Roboto、Windows 找不到那些才 fallback 到 Inter。
// next/font self-host、display: swap、Latin subset，不會 FOIT。
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "techbyte — A byte a day",
  description: "每天 5–10 分鐘，學一個科技概念，做互動驗證，強化記憶。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant" className={inter.variable}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
