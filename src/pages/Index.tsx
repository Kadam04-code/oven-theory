import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
// background visual for hero; switch to a video file instead of the static image
import heroVideo from '@/assets/hero-bakery.mp4';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
};


const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    api.get('/products').then((data) => {
      if (data) setProducts(data);
    }).catch(err => console.error('Fetch products error:', err));

    api.get('/categories').then((data) => {
      if (data && data.length > 0) {
        const names = data.map((c: any) => c.name);
        setDbCategories(['All', ...names]);
      }
    }).catch(err => console.error('Fetch categories error:', err));
  }, []);

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* use a looping, muted video as the background; ensure the file exists in assets */}
          <video autoPlay muted loop playsInline className="h-full w-full object-cover">
            <source src={heroVideo} type="video/mp4" />
            {/* optional fallback image */}
            {/* <img src="/assets/hero-bakery.png" alt="Fresh bakery goods" className="h-full w-full object-cover" /> */}
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
        </div>
        <div className="relative container mx-auto flex min-h-[400px] items-center px-4 py-20">
          <div className="max-w-lg animate-fade-in">
            <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl">
              Freshly Baked,<br />Daily with Love
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Artisan breads, pastries, and cakes crafted with the finest ingredients.
            </p>
            <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container mx-auto px-4 py-12">
        <h2 className="mb-6 font-display text-3xl font-bold">Our Products</h2>
        <div className="mb-8 flex flex-wrap gap-2">
          {dbCategories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
