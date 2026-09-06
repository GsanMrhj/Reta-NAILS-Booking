import type { Metadata } from "next";
import "./globals.css";

// هنا نحدد اسم الموقع، الوصف، والبانر أو الصورة التي تظهر عند مشاركة الرابط أو في جوجل
export const metadata: Metadata = {
  title: "Reta Nails | صالون ريتا للأظافر ",
  description: "احجزي موعدك الملكي لأفضل خدمات العناية بالأظافر .",
  keywords: ["Reta Nails", "صالون أظافر", "حجز موعد أظافر", "جل بولش", "بديكير", "ريتا نيلز"],
  openGraph: {
    title: "Reta Nails | صالون ريتا للأظافر",
    description: "احجزي موعدك الآن في صالون ريتا للأظافر وتألقي بإطلالة ملكية.",
    url: "https://retanails.com", // استبدلها برابط موقعك الحقيقي لاحقاً
    siteName: "Reta Nails",
    images: [
      {
        url: "/logo.jpg", // ستظهر صورة اللوجو كبنر رئيسي عند مشاركة الرابط بالواتساب أو السوشيال ميديا
        width: 800,
        height: 800,
        alt: "Reta Nails Logo",
      },
    ],
    locale: "ar_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}