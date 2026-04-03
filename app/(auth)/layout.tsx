import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image 
            src="/auth-image.png"
            alt="Auth image"
            width={600}
            height={800}
            className="rounded-l-xl object-contain border-8 border-cyan-800 border-r-0"
          />
        </div>
      </div>
    </main>
  );
}

