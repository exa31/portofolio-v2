# Google Search Console Setup Guide

## Checklist Verifikasi Domain

### 1. **Robots.txt** ✅

File sudah diperbaiki dan valid:

- `robots.txt` mendukung kedua domain (eka-dev.cloud & www.eka-dev.cloud)
- Assets (CSS/JS/images) diizinkan untuk crawling
- Dashboard dan login pages sudah didisallow
- Query parameters yang create duplicate content sudah didisallow
- Sitemap sudah ditambahkan untuk kedua domain

### 2. **Sitemap** ✅

- File `sitemap.xml` sudah ada di `/public/sitemap.xml`
- Robots.txt sudah referensi ke sitemap:
  ```
  Sitemap: https://eka-dev.cloud/sitemap.xml
  Sitemap: https://www.eka-dev.cloud/sitemap.xml
  ```

### 3. **Google Site Verification**

Langkah-langkah untuk verify domain:

#### Opsi A: HTML Tag Method (Recommended)

1. Go to: https://search.google.com/search-console
2. Click "Add property"
3. Enter domain: `https://eka-dev.cloud`
4. Choose "HTML tag" verification method
5. Copy the verification code yang diberikan
6. Di `nuxt.config.ts`, uncomment dan fill line 65:
   ```typescript
   {name: 'google-site-verification', content: 'YOUR_VERIFICATION_CODE'}
   ```
   Ganti `YOUR_VERIFICATION_CODE` dengan code dari Google
7. Deploy ke production
8. Kembali ke Google Search Console, click "Verify"

#### Opsi B: Domain Name System (DNS) Method

1. Go to Google Search Console
2. Add property dengan domain name
3. Verify via DNS TXT record (recommended untuk production)
4. Follow DNS provider instructions

#### Opsi C: File Upload Method

1. Download verification file dari Google Search Console
2. Upload ke `/public/` folder
3. Deploy dan akses via: `https://eka-dev.cloud/<verification-file>`

---

## SEO Improvements Sudah Di-Apply ✅

### 1. **Head Tags di nuxt.config.ts**

- ✅ Title dan meta description
- ✅ Open Graph tags (og:title, og:description, og:image, og:url)
- ✅ Twitter Card tags
- ✅ Canonical URL (https://eka-dev.cloud)
- ✅ Preconnect dan DNS prefetch untuk performance
- ✅ Placeholder untuk Google Site Verification

### 2. **Robots.txt Improvements**

- ✅ Valid format dengan User-Agent: *
- ✅ Allow semua public pages
- ✅ Disallow dashboard dan login
- ✅ Allow assets (CSS, JS, images)
- ✅ Disallow query parameters untuk avoid duplicate content
- ✅ Crawl-delay: 1 second

### 3. **Sitemap**

- ✅ Valid XML format
- ✅ Includes homepage, privacy, dan terms
- ✅ Includes lastmod dan priority
- ✅ Referenced di robots.txt

### 4. **Image Optimization**

- ✅ WebP dan AVIF format support
- ✅ Quality: 80 untuk balance size vs quality
- ✅ Uses og-image.webp untuk social sharing

### 5. **Site Structure**

- ✅ SSR enabled untuk crawlability
- ✅ Prerender routes: `/`, `/privacy`, `/terms`
- ✅ Clean URL structure
- ✅ Gzip & Brotli compression

---

## Production Deployment Checklist

Sebelum deploy, pastikan:

- [ ] Robots.txt already fixed ✅
- [ ] Sitemap created ✅
- [ ] Meta tags in nuxt.config.ts ✅
- [ ] Google Site Verification code ditambahkan di nuxt.config.ts
- [ ] Environment variables sudah set dengan benar
- [ ] Deploy to production
- [ ] Verify di Google Search Console
- [ ] Submit sitemap di GSC
- [ ] Monitor crawl stats & coverage

---

## Links untuk Reference

- **Google Search Console**: https://search.google.com/search-console
- **Robots.txt Tester**: https://search.google.com/test/robots-txt
- **URL Inspection Tool**: https://search.google.com/test/url-inspection
- **Mobile Friendly Test**: https://search.google.com/test/mobile-friendly
- **Structured Data Test**: https://search.google.com/test/structured-data

---

## Lighthouse SEO Checklist

✅ Robots.txt is valid

- Robots.txt now follows proper format
- All crawlers allowed for public pages
- Sitemap included

✅ Crawlability

- SSR enabled
- No robots noindex
- Clean URL structure

✅ Mobile Friendly

- Viewport meta tag ✅
- Touch-friendly spacing
- Responsive design

✅ Performance

- Image optimization (WebP, AVIF)
- Compression (Gzip, Brotli)
- Modern JavaScript

---

## TODO: Setelah Verify Domain

1. **Add Google Analytics 4**
   ```typescript
   // Di nuxt.config.ts bagian modules
   modules: ['nuxt-gtag']
   ```

2. **Add Schema Markup**
    - PersonSchema untuk author
    - WebsiteSchema untuk site
    - ArticleSchema untuk blog posts (jika ada)

3. **Monitor Rankings**
    - Submit queries untuk main keywords
    - Monitor position changes
    - Add backlinks

4. **Create XML Sitemap Generator** (optional)
    - Jika ada dynamic content, buat dynamic sitemap

