import "./globals.css";
import { Noto_Serif_TC } from "next/font/google";
import Providers from "./providers";
import Header from "@/components/Header";

// CJK 字型整份就是一個 subset，不能再分割；preload 整份太大故關掉。
// 用 variable 讓 inline-style 字型 stack 也能 fallback 到這個 webfont。
const notoSerifTC = Noto_Serif_TC({
  weight: ["500", "700"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-tc",
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
    <html lang="zh-Hant" className={notoSerifTC.variable}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
