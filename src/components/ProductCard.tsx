import { useCart } from '@/contexts/CartContext';
import { useAppContext } from '@/contexts/AppContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import local images for fallback
import croissantImg from '@/assets/croissant.png';
import sourdoughImg from '@/assets/sourdough.png';
import cookiesImg from '@/assets/cookies.png';
import cakeImg from '@/assets/cake.png';
import baguetteImg from '@/assets/baguette.png';
import cinnamonRollsImg from '@/assets/cinnamon-rolls.png';
import muffinsImg from '@/assets/muffins.png';
import garlicBreadImg from '@/assets/garlic-bread.jpg';
import wholeWheatImg from '@/assets/whole-wheat-bread.jpg';
import pavBunImg from '@/assets/pav-bun.jpg';
import chocoTruffleCakeImg from '@/assets/chocolate-truffle-cake.jpg';
import redVelvetImg from '@/assets/red-velvet-cake.jpg';
import pineapplePastryImg from '@/assets/pineapple-pastry.jpg';
import vegPuffImg from '@/assets/veg-puff.jpg';
import samosaImg from '@/assets/samosa.jpg';
import almondCookiesImg from '@/assets/almond-cookies.jpg';
import nanKhataiImg from '@/assets/nan-khatai.jpg';
import blackForestImg from '@/assets/black-forest-cake.jpg';
import bananaBreadImg from '@/assets/banana-bread.jpg';

const imageMap: Record<string, string> = {
  '/assets/croissant.png': croissantImg,
  '/assets/sourdough.png': sourdoughImg,
  '/assets/cookies.png': cookiesImg,
  '/assets/cake.png': cakeImg,
  '/assets/baguette.png': baguetteImg,
  '/assets/cinnamon-rolls.png': cinnamonRollsImg,
  '/assets/muffins.png': muffinsImg,
  '/assets/garlic-bread.jpg': garlicBreadImg,
  '/assets/whole-wheat-bread.jpg': wholeWheatImg,
  '/assets/pav-bun.jpg': pavBunImg,
  '/assets/chocolate-truffle-cake.jpg': chocoTruffleCakeImg,
  '/assets/red-velvet-cake.jpg': redVelvetImg,
  '/assets/pineapple-pastry.jpg': pineapplePastryImg,
  '/assets/veg-puff.jpg': vegPuffImg,
  '/assets/samosa.jpg': samosaImg,
  '/assets/almond-cookies.jpg': almondCookiesImg,
  '/assets/nan-khatai.jpg': nanKhataiImg,
  '/assets/black-forest-cake.jpg': blackForestImg,
  '/assets/banana-bread.jpg': bananaBreadImg,
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const imgSrc = product.image_url ? (imageMap[product.image_url] || product.image_url) : '/placeholder.svg';

  const handleAdd = () => {
    if (!user) {
      toast.info('Please sign in to add items to cart');
      navigate('/login');
      return;
    }
    addItem({ id: product.id, name: product.name, price: product.price, category: product.category, image_url: product.image_url });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in">
      <div className="aspect-square overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {product.category}
        </span>
        <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-accent">₹{Number(product.price).toFixed(2)}</span>
          <Button size="sm" onClick={handleAdd} className="gap-1 rounded-full px-4">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
