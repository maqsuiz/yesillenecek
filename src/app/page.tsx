import { Navbar } from '@/components/navbar';
import { NewsGrid } from '@/components/news-grid';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <NewsGrid />
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Yeşillenecek. Sürdürülebilir bir gelecek için.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-green-600 transition-colors">Hakkımızda</a>
            <a href="#" className="hover:text-green-600 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-green-600 transition-colors">İletişim</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
