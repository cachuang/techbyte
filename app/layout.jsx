import "./globals.css";

export const metadata = {
  title: "techbyte — A byte a day",
  description: "每天 5–10 分鐘，學一個科技概念，做互動驗證，強化記憶。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
