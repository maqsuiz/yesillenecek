# EcoPulse TR

EcoPulse TR, sürdürülebilirlik ve iklim değişikliği konularında dünyadan ve Türkiye'den güncel haberleri bir araya getiren bir platformdur.

## Özellikler

- **Gerçek Zamanlı Haberler**: NewsData.io ve RSS feedleri (Yeşil Gazete, İklim Haber, Carbon Brief, Guardian) üzerinden otomatik haber çekme.
- **Akıllı Filtreleme**: Kategori (Sürdürülebilirlik, İklim, Karbon, Doğa) ve tarih bazlı filtreleme.
- **Modern Arayüz**: Next.js 15, Tailwind CSS ve shadcn/ui ile responsive, mobil öncelikli tasarım.
- **Otomatik Arşiv**: Supabase PostgreSQL veritabanı ile tüm haberler saklanır ve yönetilir.
- **Karanlık Mod**: Göz yormayan otomatik karanlık mod desteği.

## Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone <repo-url>
   cd ecopulse-tr
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `.env.local` dosyasını oluşturun:
   `.env.example` dosyasını kopyalayın ve gerekli API anahtarlarını girin.

4. Veritabanını hazırlayın:
   `supabase/schema.sql` dosyasındaki SQL kodlarını Supabase SQL Editor'da çalıştırın.

5. Uygulamayı çalıştırın:
   ```bash
   npm run dev
   ```

## Canlıya Alma (Deploy)

Vercel veya Netlify üzerinde kolayca deploy edebilirsiniz. Proje, App Router ve Edge Functions uyumludur.

### Cron Job Kurulumu

Her 30 dakikada bir haber çekmek için bir cron job kurmanız önerilir:
- **Vercel**: `vercel.json` dosyasına cron tanımı ekleyin.
- **Supabase**: `supabase/functions/fetch-news` fonksiyonunu zamanlanmış bir iş olarak atayın.

## API Rotaları

- `/api/fetch-news`: Yeni haberleri çekmek için manuel tetikleme (GET/POST).

## Lisans

MIT
