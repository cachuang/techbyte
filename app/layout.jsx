import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/Header";

// Inter 只載 Latin subset。中文不在這份字型裡 → 瀏覽器會自動 fallback
// 到 --font-sans 後面的 PingFang TC / Noto Sans CJK 等原生字。
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
